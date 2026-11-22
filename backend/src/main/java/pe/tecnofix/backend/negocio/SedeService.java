package pe.tecnofix.backend.negocio;

import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pe.tecnofix.backend.datos.OrdenRepository;
import pe.tecnofix.backend.datos.SedeRepository;
import pe.tecnofix.backend.modelo.EstadoOrden;
import pe.tecnofix.backend.modelo.Sede;

@Service
@Transactional
public class SedeService {

    private final SedeRepository sedes;
    private final OrdenRepository ordenes;

    public SedeService(SedeRepository sedes, OrdenRepository ordenes) {
        this.sedes = sedes;
        this.ordenes = ordenes;
    }

    public List<Sede> listar() {
        return sedes.findAll(Sort.by("id"));
    }

    public Sede obtener(Long id) {
        return sedes.findById(id).orElseThrow(() -> new NoEncontradoException("La sede " + id + " no existe."));
    }

    public Sede crear(Solicitudes.SedeDatos datos) {
        String nombre = datos.nombre().trim();
        if (sedes.existsByNombreIgnoreCase(nombre)) {
            throw new ReglaNegocioException("Ya existe una sede llamada " + nombre + ".");
        }
        Sede sede = new Sede();
        sede.setNombre(nombre);
        sede.setCiudad(datos.ciudad().trim());
        sede.setTelefono(datos.telefono());
        sede.setActiva(true);
        return sedes.save(sede);
    }

    public Sede actualizar(Long id, Solicitudes.SedeDatos datos) {
        Sede sede = obtener(id);
        String nombre = datos.nombre().trim();
        if (sedes.existsByNombreIgnoreCaseAndIdNot(nombre, id)) {
            throw new ReglaNegocioException("Ya existe una sede llamada " + nombre + ".");
        }
        sede.setNombre(nombre);
        sede.setCiudad(datos.ciudad().trim());
        sede.setTelefono(datos.telefono());
        return sedes.save(sede);
    }

    public Sede cambiarEstado(Long id) {
        Sede sede = obtener(id);
        if (sede.isActiva() && ordenes.countBySede_IdAndEstadoNot(id, EstadoOrden.ENTREGADO) > 0) {
            throw new ReglaNegocioException("No se puede desactivar: la sede tiene órdenes sin entregar.");
        }
        sede.setActiva(!sede.isActiva());
        return sedes.save(sede);
    }
}