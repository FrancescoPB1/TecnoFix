package pe.tecnofix.backend.negocio;

import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pe.tecnofix.backend.datos.EquipoRepository;
import pe.tecnofix.backend.datos.TipoEquipoRepository;
import pe.tecnofix.backend.modelo.TipoEquipo;

@Service
@Transactional
public class TipoEquipoService {

    private final TipoEquipoRepository tipos;
    private final EquipoRepository equipos;

    public TipoEquipoService(TipoEquipoRepository tipos, EquipoRepository equipos) {
        this.tipos = tipos;
        this.equipos = equipos;
    }

    public List<TipoEquipo> listar() {
        return tipos.findAll(Sort.by("id"));
    }

    public TipoEquipo obtener(Long id) {
        return tipos.findById(id).orElseThrow(() -> new NoEncontradoException("El tipo de equipo " + id + " no existe."));
    }

    public TipoEquipo crear(Solicitudes.TipoEquipoDatos datos) {
        String nombre = datos.nombre().trim();
        if (tipos.existsByNombreIgnoreCase(nombre)) {
            throw new ReglaNegocioException("El tipo " + nombre + " ya está registrado.");
        }
        TipoEquipo tipo = new TipoEquipo();
        tipo.setNombre(nombre);
        return tipos.save(tipo);
    }

    public void eliminar(Long id) {
        TipoEquipo tipo = obtener(id);
        if (equipos.countByTipo_Id(id) > 0) {
            throw new ReglaNegocioException("No se puede eliminar: hay equipos registrados con ese tipo.");
        }
        tipos.delete(tipo);
    }
}