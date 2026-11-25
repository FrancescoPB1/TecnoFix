package pe.tecnofix.backend.datos;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import pe.tecnofix.backend.modelo.AvanceReparacion;
import pe.tecnofix.backend.modelo.Cliente;
import pe.tecnofix.backend.modelo.Decision;
import pe.tecnofix.backend.modelo.Equipo;
import pe.tecnofix.backend.modelo.EstadoOrden;
import pe.tecnofix.backend.modelo.MovimientoOrden;
import pe.tecnofix.backend.modelo.Orden;
import pe.tecnofix.backend.modelo.Rol;
import pe.tecnofix.backend.modelo.Sede;
import pe.tecnofix.backend.modelo.TipoEquipo;
import pe.tecnofix.backend.modelo.Usuario;


@Component
public class CargadorDatos implements CommandLineRunner {

    private final SedeRepository sedes;
    private final TipoEquipoRepository tipos;
    private final ClienteRepository clientes;
    private final EquipoRepository equipos;
    private final UsuarioRepository usuarios;
    private final OrdenRepository ordenes;
    private final BCryptPasswordEncoder codificador;

    public CargadorDatos(SedeRepository sedes, TipoEquipoRepository tipos, ClienteRepository clientes,
                         EquipoRepository equipos, UsuarioRepository usuarios, OrdenRepository ordenes,
                         BCryptPasswordEncoder codificador) {
        this.sedes = sedes;
        this.tipos = tipos;
        this.clientes = clientes;
        this.equipos = equipos;
        this.usuarios = usuarios;
        this.ordenes = ordenes;
        this.codificador = codificador;
    }

    @Override
    public void run(String... args) {
        if (sedes.count() > 0) {
            return;
        }

        Sede limaCentro = sedes.save(sede("Lima Centro", "Lima", "014000101"));
        Sede limaNorte = sedes.save(sede("Lima Norte", "Lima", "014000102"));
        Sede trujillo = sedes.save(sede("Trujillo", "Trujillo", "044000103"));

        TipoEquipo celular = tipos.save(tipo("Celular"));
        TipoEquipo tablet = tipos.save(tipo("Tablet"));
        TipoEquipo televisor = tipos.save(tipo("Televisor"));
        TipoEquipo laptop = tipos.save(tipo("Laptop"));
        TipoEquipo electrodomestico = tipos.save(tipo("Electrodoméstico"));

        Cliente luis = clientes.save(cliente("45871236", "Luis Paredes Rojas", "luis.paredes@correo.com", "987654321"));
        Cliente ana = clientes.save(cliente("72418596", "Ana Rojas Vega", "ana.rojas@correo.com", "945123678"));
        Cliente pedro = clientes.save(cliente("41256387", "Pedro Salinas Cruz", "pedro.salinas@correo.com", "912345987"));

        String clave = codificador.encode("demo123");
        usuarios.save(personal("Marcela Torres", "recepcion", clave, Rol.RECEPCION, limaCentro, "40125478", "944100200", "marcela.torres@correo.com", null));
        Usuario julio = usuarios.save(personal("Julio Quispe", "tecnico1", clave, Rol.TECNICO, limaCentro, "41236587", "955200300", "julio.quispe@correo.com", "Celulares y tablets"));
        Usuario carla = usuarios.save(personal("Carla Vera", "tecnico2", clave, Rol.TECNICO, limaCentro, "42587963", "966300400", "carla.vera@correo.com", "Laptops"));
        Usuario rolando = usuarios.save(personal("Rolando Díaz", "tecnico3", clave, Rol.TECNICO, trujillo, "43698521", "977400500", "rolando.diaz@correo.com", "Línea blanca"));
        usuarios.save(acceso("cliente1", clave, luis));
        usuarios.save(acceso("cliente2", clave, ana));
        usuarios.save(personal("Ricardo Salazar", "admin", clave, Rol.ADMIN, null, "40789654", "988500600", "ricardo.salazar@correo.com", null));
        usuarios.save(personal("Diego Alarcón", "recepcion2", clave, Rol.RECEPCION, limaNorte, "44125896", "933600700", "diego.alarcon@correo.com", null));
        usuarios.save(personal("Patricia Lozano", "recepcion3", clave, Rol.RECEPCION, trujillo, "45236987", "922700800", "patricia.lozano@correo.com", null));
        Usuario monica = usuarios.save(personal("Mónica Ruiz", "tecnico4", clave, Rol.TECNICO, limaNorte, "46321458", "911800900", "monica.ruiz@correo.com", "Televisores"));

        Equipo galaxyA54 = equipos.save(equipo(luis, celular, "Galaxy A54", "356938035643809", "2026-03-10"));
        Equipo televisorCu7000 = equipos.save(equipo(ana, televisor, "UN55CU7000", "TV-77412", "2024-11-05"));
        Equipo galaxyBook = equipos.save(equipo(luis, laptop, "Galaxy Book3", "NB-8842", "2025-02-14"));
        Equipo lavadora = equipos.save(equipo(pedro, electrodomestico, "Lavadora WA19", "LV-30551", "2026-01-20"));
        Equipo galaxyTab = equipos.save(equipo(ana, tablet, "Galaxy Tab A9", "TB-90217", "2025-06-02"));

        Orden o1 = orden("ST-0001", luis, galaxyA54, limaCentro, julio, true,
                "La batería se descarga muy rápido y el equipo se apaga solo.", "Cargador original",
                EstadoOrden.EN_DIAGNOSTICO);
        movimiento(o1, "2026-10-26T09:10:00", EstadoOrden.RECIBIDO, "Marcela Torres", "Equipo recibido con cargador original. Está en garantía.");
        movimiento(o1, "2026-10-26T11:30:00", EstadoOrden.EN_DIAGNOSTICO, "Marcela Torres", "Asignada a Julio Quispe.");
        ordenes.save(o1);

        Orden o2 = orden("ST-0002", ana, televisorCu7000, limaNorte, null, false,
                "La pantalla muestra líneas verticales y a veces no enciende.", "Control remoto",
                EstadoOrden.RECIBIDO);
        movimiento(o2, "2026-10-28T08:45:00", EstadoOrden.RECIBIDO, "Diego Alarcón", "Equipo recibido con control remoto. Garantía vencida.");
        ordenes.save(o2);

        Orden o3 = orden("ST-0003", luis, galaxyBook, limaCentro, carla, false,
                "El sistema tarda mucho en iniciar y se congela.", "Cargador, mochila",
                EstadoOrden.PRESUPUESTO_ENVIADO);
        o3.setDiagnostico("Unidad de almacenamiento con sectores dañados. Se recomienda cambiarla por una SSD y reinstalar el sistema.");
        o3.setMontoPresupuesto(new BigDecimal("280.00"));
        movimiento(o3, "2026-10-24T10:00:00", EstadoOrden.RECIBIDO, "Marcela Torres", "Equipo recibido con cargador y mochila. Garantía vencida.");
        movimiento(o3, "2026-10-24T12:15:00", EstadoOrden.EN_DIAGNOSTICO, "Marcela Torres", "Asignada a Carla Vera.");
        movimiento(o3, "2026-10-25T16:40:00", EstadoOrden.PRESUPUESTO_ENVIADO, "Carla Vera", "Presupuesto de S/ 280.00 enviado al cliente.");
        ordenes.save(o3);

        Orden o4 = orden("ST-0004", pedro, lavadora, trujillo, rolando, true,
                "No desagua y muestra un código de error en el panel.", "Manguera de desagüe",
                EstadoOrden.EN_REPARACION);
        o4.setDiagnostico("Bomba de desagüe obstruida y con desgaste. Se reemplaza la bomba (cubierto por garantía).");
        o4.setMontoPresupuesto(BigDecimal.ZERO);
        o4.setDecision(Decision.APROBADO);
        avance(o4, "2026-10-24T09:00:00", "Rolando Díaz", "Se desmontó la bomba de desagüe y se retiró la obstrucción.", "Ninguno", "");
        avance(o4, "2026-10-24T14:30:00", "Rolando Díaz", "Cambio de la bomba de desagüe.", "Bomba de desagüe", "");
        movimiento(o4, "2026-10-22T09:30:00", EstadoOrden.RECIBIDO, "Patricia Lozano", "Equipo recibido con manguera de desagüe. Está en garantía.");
        movimiento(o4, "2026-10-22T10:00:00", EstadoOrden.EN_DIAGNOSTICO, "Patricia Lozano", "Asignada a Rolando Díaz.");
        movimiento(o4, "2026-10-23T15:20:00", EstadoOrden.EN_REPARACION, "Rolando Díaz", "Diagnóstico registrado. Cubierto por garantía: pasa directo a reparación.");
        ordenes.save(o4);

        Orden o5 = orden("ST-0005", ana, galaxyTab, limaNorte, monica, false,
                "La pantalla no responde al tacto.", "Cargador, funda",
                EstadoOrden.LISTO_PARA_ENTREGA);
        o5.setDiagnostico("Conector del panel táctil suelto. Se reconectó y se calibró.");
        o5.setMontoPresupuesto(new BigDecimal("60.00"));
        o5.setDecision(Decision.APROBADO);
        avance(o5, "2026-10-22T10:00:00", "Mónica Ruiz", "Reconexión del cable del panel táctil.", "Ninguno", "");
        avance(o5, "2026-10-22T16:45:00", "Mónica Ruiz", "Calibración del panel táctil.", "Ninguno", "Táctil y pantalla sin fallas durante 30 minutos.");
        movimiento(o5, "2026-10-20T11:00:00", EstadoOrden.RECIBIDO, "Diego Alarcón", "Equipo recibido con cargador y funda. Garantía vencida.");
        movimiento(o5, "2026-10-20T11:20:00", EstadoOrden.EN_DIAGNOSTICO, "Diego Alarcón", "Asignada a Mónica Ruiz.");
        movimiento(o5, "2026-10-21T10:10:00", EstadoOrden.PRESUPUESTO_ENVIADO, "Mónica Ruiz", "Presupuesto de S/ 60.00 enviado al cliente.");
        movimiento(o5, "2026-10-21T12:00:00", EstadoOrden.EN_REPARACION, "Ana Rojas Vega", "El cliente aprobó el presupuesto.");
        movimiento(o5, "2026-10-22T17:30:00", EstadoOrden.LISTO_PARA_ENTREGA, "Mónica Ruiz", "Reparación y pruebas completadas.");
        ordenes.save(o5);
    }

    private Sede sede(String nombre, String ciudad, String telefono) {
        Sede sede = new Sede();
        sede.setNombre(nombre);
        sede.setCiudad(ciudad);
        sede.setTelefono(telefono);
        sede.setActiva(true);
        return sede;
    }

    private TipoEquipo tipo(String nombre) {
        TipoEquipo tipo = new TipoEquipo();
        tipo.setNombre(nombre);
        return tipo;
    }

    private Cliente cliente(String dni, String nombres, String correo, String telefono) {
        Cliente cliente = new Cliente();
        cliente.setDni(dni);
        cliente.setNombres(nombres);
        cliente.setCorreo(correo);
        cliente.setTelefono(telefono);
        return cliente;
    }

    private Usuario personal(String nombre, String usuario, String clave, Rol rol, Sede sede, String dni,
                             String telefono, String correo, String especialidad) {
        Usuario personal = new Usuario();
        personal.setNombre(nombre);
        personal.setUsuario(usuario);
        personal.setClave(clave);
        personal.setRol(rol);
        personal.setActivo(true);
        personal.setSede(sede);
        personal.setDni(dni);
        personal.setTelefono(telefono);
        personal.setCorreo(correo);
        personal.setEspecialidad(especialidad);
        return personal;
    }

    private Usuario acceso(String usuario, String clave, Cliente cliente) {
        Usuario acceso = new Usuario();
        acceso.setNombre(cliente.getNombres());
        acceso.setUsuario(usuario);
        acceso.setClave(clave);
        acceso.setRol(Rol.CLIENTE);
        acceso.setActivo(true);
        acceso.setCliente(cliente);
        return acceso;
    }

    private Equipo equipo(Cliente cliente, TipoEquipo tipo, String modelo, String serie, String fechaCompra) {
        Equipo equipo = new Equipo();
        equipo.setCliente(cliente);
        equipo.setTipo(tipo);
        equipo.setModelo(modelo);
        equipo.setSerie(serie);
        equipo.setFechaCompra(LocalDate.parse(fechaCompra));
        return equipo;
    }

    private Orden orden(String codigo, Cliente cliente, Equipo equipo, Sede sede, Usuario tecnico,
                        boolean enGarantia, String falla, String accesorios, EstadoOrden estado) {
        Orden orden = new Orden();
        orden.setCodigo(codigo);
        orden.setCliente(cliente);
        orden.setEquipo(equipo);
        orden.setSede(sede);
        orden.setTecnico(tecnico);
        orden.setEnGarantia(enGarantia);
        orden.setFalla(falla);
        for (String nombre : accesorios.split(",")) {
            if (!nombre.isBlank()) {
                orden.agregarAccesorio(nombre.trim());
            }
        }
        orden.setEstado(estado);
        return orden;
    }

    private void avance(Orden orden, String fecha, String tecnico, String actividad, String repuestos, String pruebas) {
        AvanceReparacion avance = new AvanceReparacion();
        avance.setOrden(orden);
        avance.setFecha(LocalDateTime.parse(fecha));
        avance.setTecnico(tecnico);
        avance.setActividad(actividad);
        avance.setRepuestos(repuestos);
        avance.setPruebas(pruebas);
        orden.getAvances().add(avance);
    }

    private void movimiento(Orden orden, String fecha, EstadoOrden estado, String responsable, String detalle) {
        MovimientoOrden movimiento = new MovimientoOrden();
        movimiento.setOrden(orden);
        movimiento.setFecha(LocalDateTime.parse(fecha));
        movimiento.setEstado(estado);
        movimiento.setResponsable(responsable);
        movimiento.setDetalle(detalle);
        orden.getHistorial().add(movimiento);
    }
}