package pe.tecnofix.backend.negocio;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pe.tecnofix.backend.datos.ClienteRepository;
import pe.tecnofix.backend.datos.EquipoRepository;
import pe.tecnofix.backend.datos.OrdenRepository;
import pe.tecnofix.backend.datos.UsuarioRepository;
import pe.tecnofix.backend.modelo.Cliente;
import pe.tecnofix.backend.modelo.Decision;
import pe.tecnofix.backend.modelo.Equipo;
import pe.tecnofix.backend.modelo.EstadoOrden;
import pe.tecnofix.backend.modelo.Orden;
import pe.tecnofix.backend.modelo.Rol;
import pe.tecnofix.backend.modelo.Sede;
import pe.tecnofix.backend.modelo.TipoEquipo;
import pe.tecnofix.backend.modelo.Usuario;
import pe.tecnofix.backend.seguridad.UsuarioSesion;

@Service
@Transactional
public class OrdenService {

    public static final int MESES_GARANTIA = 12;

    private final OrdenRepository ordenes;
    private final ClienteRepository clientes;
    private final EquipoRepository equipos;
    private final UsuarioRepository usuarios;
    private final ClienteService clienteService;
    private final SedeService sedeService;
    private final TipoEquipoService tipoEquipoService;

    public OrdenService(OrdenRepository ordenes, ClienteRepository clientes, EquipoRepository equipos,
                        UsuarioRepository usuarios, ClienteService clienteService, SedeService sedeService,
                        TipoEquipoService tipoEquipoService) {
        this.ordenes = ordenes;
        this.clientes = clientes;
        this.equipos = equipos;
        this.usuarios = usuarios;
        this.clienteService = clienteService;
        this.sedeService = sedeService;
        this.tipoEquipoService = tipoEquipoService;
    }


    @Transactional(readOnly = true)
    public List<Orden> listar(UsuarioSesion sesion, Long sedeId) {
        return switch (sesion.rol()) {
            case ADMIN -> sedeId == null ? ordenes.findAllByOrderByIdDesc() : ordenes.findBySede_IdOrderByIdDesc(sedeId);
            case RECEPCION -> ordenes.findBySede_IdOrderByIdDesc(sesion.sedeId());
            case TECNICO -> ordenes.findByTecnico_IdOrderByIdDesc(sesion.id());
            case CLIENTE -> ordenes.findByCliente_IdOrderByIdDesc(sesion.clienteId());
        };
    }

    @Transactional(readOnly = true)
    public Orden obtener(Long id, UsuarioSesion sesion) {
        Orden orden = buscar(id);
        verificarAcceso(orden, sesion);
        return orden;
    }


    public Respuestas.RecepcionRespuesta recepcionar(Solicitudes.Recepcion datos, UsuarioSesion sesion) {
        if (sesion.sedeId() == null) {
            throw new ProhibidoException("Su cuenta no tiene una sede asignada.");
        }
        Sede sede = sedeService.obtener(sesion.sedeId());
        if (!sede.isActiva()) {
            throw new ReglaNegocioException("La sede " + sede.getNombre() + " está desactivada.");
        }
        TipoEquipo tipo = tipoEquipoService.obtener(datos.tipoId());

        Respuestas.AccesoCliente accesoNuevo = null;
        Cliente cliente = clientes.findByDni(datos.dni()).orElse(null);
        if (cliente == null) {
            if (vacio(datos.nombres()) || vacio(datos.correo()) || vacio(datos.telefono())) {
                throw new ReglaNegocioException("El cliente no existe; complete sus nombres, correo y teléfono.");
            }
            Respuestas.ClienteConAcceso creado = clienteService.crear(
                    datos.dni(), datos.nombres(), datos.correo(), datos.telefono());
            cliente = creado.cliente();
            accesoNuevo = creado.acceso();
        }

        String serie = datos.serie().trim();
        Equipo equipo = equipos.findByCliente_IdAndSerie(cliente.getId(), serie).orElse(null);
        if (equipo != null) {
            if (ordenes.existsByEquipo_IdAndEstadoNot(equipo.getId(), EstadoOrden.ENTREGADO)) {
                throw new ReglaNegocioException("Este equipo ya tiene una orden abierta.");
            }
        } else {
            equipo = new Equipo();
            equipo.setCliente(cliente);
            equipo.setTipo(tipo);
            equipo.setModelo(datos.modelo().trim());
            equipo.setSerie(serie);
            equipo.setFechaCompra(datos.fechaCompra());
            equipo = equipos.save(equipo);
        }

        boolean enGarantia = garantiaVigente(equipo.getFechaCompra(), LocalDate.now());
        String accesorios = datos.accesorios() == null ? "" : datos.accesorios().trim();

        Orden orden = new Orden();
        orden.setCodigo(UUID.randomUUID().toString().substring(0, 10));
        orden.setCliente(cliente);
        orden.setEquipo(equipo);
        orden.setSede(sede);
        orden.setEnGarantia(enGarantia);
        orden.setFalla(datos.falla().trim());
        orden.setAccesorios(accesorios);
        orden.setEstado(EstadoOrden.RECIBIDO);
        orden.agregarMovimiento(EstadoOrden.RECIBIDO, sesion.nombre(),
                "Equipo recibido. Accesorios: " + (accesorios.isEmpty() ? "ninguno" : accesorios) + ". "
                        + (enGarantia ? "Está en garantía." : "Garantía vencida."));
        orden = ordenes.save(orden);

        orden.setCodigo(String.format("ST-%04d", orden.getId()));
        orden = ordenes.save(orden);
        return new Respuestas.RecepcionRespuesta(orden, accesoNuevo);
    }


    public Orden asignar(Long id, Solicitudes.Asignacion datos, UsuarioSesion sesion) {
        Orden orden = buscar(id);
        verificarAcceso(orden, sesion);
        exigirEstado(orden, "asignar un técnico", EstadoOrden.RECIBIDO);

        Usuario tecnico = usuarios.findById(datos.tecnicoId())
                .orElseThrow(() -> new NoEncontradoException("El técnico " + datos.tecnicoId() + " no existe."));
        if (tecnico.getRol() != Rol.TECNICO || !tecnico.isActivo()) {
            throw new ReglaNegocioException("El usuario elegido no es un técnico activo.");
        }
        if (tecnico.getSedeId() == null || !tecnico.getSedeId().equals(orden.getSedeId())) {
            throw new ReglaNegocioException("El técnico debe pertenecer a la misma sede de la orden.");
        }
        orden.setTecnico(tecnico);
        orden.setEstado(EstadoOrden.EN_DIAGNOSTICO);
        orden.agregarMovimiento(EstadoOrden.EN_DIAGNOSTICO, sesion.nombre(), "Asignada a " + tecnico.getNombre() + ".");
        return ordenes.save(orden);
    }

   
    public Orden diagnosticar(Long id, Solicitudes.Diagnostico datos, UsuarioSesion sesion) {
        Orden orden = buscar(id);
        exigirTecnicoAsignado(orden, sesion);
        exigirEstado(orden, "registrar el diagnóstico", EstadoOrden.EN_DIAGNOSTICO);

        orden.setDiagnostico(datos.diagnostico().trim());
        if (orden.isEnGarantia()) {
            orden.setMontoPresupuesto(BigDecimal.ZERO);
            orden.setDecision(Decision.APROBADO);
            orden.setEstado(EstadoOrden.EN_REPARACION);
            orden.agregarMovimiento(EstadoOrden.EN_REPARACION, sesion.nombre(),
                    "Diagnóstico registrado. Cubierto por garantía: pasa directo a reparación.");
        } else {
            if (datos.monto() == null) {
                throw new ReglaNegocioException("Ingrese el monto del presupuesto.");
            }
            orden.setMontoPresupuesto(datos.monto());
            orden.setEstado(EstadoOrden.PRESUPUESTO_ENVIADO);
            orden.agregarMovimiento(EstadoOrden.PRESUPUESTO_ENVIADO, sesion.nombre(),
                    String.format(Locale.US, "Presupuesto de S/ %.2f enviado al cliente.", datos.monto()));
        }
        return ordenes.save(orden);
    }

    public Orden decidir(Long id, Solicitudes.DecisionPresupuesto datos, UsuarioSesion sesion) {
        Orden orden = buscar(id);
        if (sesion.clienteId() == null || !sesion.clienteId().equals(orden.getClienteId())) {
            throw new ProhibidoException("Solo el cliente de la orden puede decidir sobre el presupuesto.");
        }
        exigirEstado(orden, "decidir el presupuesto", EstadoOrden.PRESUPUESTO_ENVIADO);

        boolean aprobado = datos.aprobado();
        orden.setDecision(aprobado ? Decision.APROBADO : Decision.RECHAZADO);
        orden.setEstado(aprobado ? EstadoOrden.EN_REPARACION : EstadoOrden.DEVUELTO_SIN_REPARAR);
        orden.agregarMovimiento(orden.getEstado(), sesion.nombre(),
                aprobado ? "El cliente aprobó el presupuesto." : "El cliente rechazó el presupuesto.");
        return ordenes.save(orden);
    }

    public Orden reparar(Long id, Solicitudes.Reparacion datos, UsuarioSesion sesion) {
        Orden orden = buscar(id);
        exigirTecnicoAsignado(orden, sesion);
        exigirEstado(orden, "registrar la reparacion", EstadoOrden.EN_REPARACION);

        if (datos.terminada() && vacio(datos.pruebas())) {
            throw new ReglaNegocioException("Para dejar la orden lista debe registrar las pruebas realizadas.");
        }
        orden.setActividad(datos.actividad().trim());
        orden.setRepuestos(datos.repuestos() == null ? "" : datos.repuestos().trim());
        orden.setPruebas(datos.pruebas() == null ? "" : datos.pruebas().trim());
        if (datos.terminada()) {
            orden.setEstado(EstadoOrden.LISTO_PARA_ENTREGA);
            orden.agregarMovimiento(EstadoOrden.LISTO_PARA_ENTREGA, sesion.nombre(), "Reparación y pruebas completadas.");
        }
        return ordenes.save(orden);
    }

    public Orden entregar(Long id, Solicitudes.Entrega datos, UsuarioSesion sesion) {
        Orden orden = buscar(id);
        verificarAcceso(orden, sesion);
        exigirEstado(orden, "registrar la entrega", EstadoOrden.LISTO_PARA_ENTREGA, EstadoOrden.DEVUELTO_SIN_REPARAR);

        orden.setReceptor(datos.receptor().trim());
        orden.setAccesoriosDevueltos(datos.accesoriosDevueltos() == null ? "" : datos.accesoriosDevueltos().trim());
        orden.setObservacionesEntrega(datos.observaciones() == null ? "" : datos.observaciones().trim());
        orden.setEstado(EstadoOrden.ENTREGADO);
        orden.agregarMovimiento(EstadoOrden.ENTREGADO, sesion.nombre(), "Entregado a " + orden.getReceptor() + ".");
        return ordenes.save(orden);
    }


    public static LocalDate finGarantia(LocalDate fechaCompra) {
        return fechaCompra.plusMonths(MESES_GARANTIA);
    }

    public static boolean garantiaVigente(LocalDate fechaCompra, LocalDate hoy) {
        return !hoy.isAfter(finGarantia(fechaCompra));
    }

    private Orden buscar(Long id) {
        return ordenes.findById(id).orElseThrow(() -> new NoEncontradoException("La orden " + id + " no existe."));
    }

    private void verificarAcceso(Orden orden, UsuarioSesion sesion) {
        boolean permitido = switch (sesion.rol()) {
            case ADMIN -> true;
            case RECEPCION -> sesion.sedeId() != null && sesion.sedeId().equals(orden.getSedeId());
            case TECNICO -> sesion.id().equals(orden.getTecnicoId());
            case CLIENTE -> sesion.clienteId() != null && sesion.clienteId().equals(orden.getClienteId());
        };
        if (!permitido) {
            throw new ProhibidoException("No tiene acceso a esta orden.");
        }
    }

    private void exigirTecnicoAsignado(Orden orden, UsuarioSesion sesion) {
        if (!sesion.id().equals(orden.getTecnicoId())) {
            throw new ProhibidoException("Solo el técnico asignado a la orden puede realizar esta operación.");
        }
    }

    private void exigirEstado(Orden orden, String accion, EstadoOrden... permitidos) {
        for (EstadoOrden estado : permitidos) {
            if (orden.getEstado() == estado) {
                return;
            }
        }
        throw new ReglaNegocioException("No se puede " + accion + ": la orden está en estado " + orden.getEstado() + ".");
    }

    private boolean vacio(String texto) {
        return texto == null || texto.isBlank();
    }
}