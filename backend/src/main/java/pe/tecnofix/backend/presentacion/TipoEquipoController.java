package pe.tecnofix.backend.presentacion;

import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import pe.tecnofix.backend.modelo.Rol;
import pe.tecnofix.backend.modelo.TipoEquipo;
import pe.tecnofix.backend.negocio.Solicitudes;
import pe.tecnofix.backend.negocio.TipoEquipoService;
import pe.tecnofix.backend.seguridad.RolesPermitidos;

@RestController
@RequestMapping("/api/tipos-equipo")
public class TipoEquipoController {

    private final TipoEquipoService tipos;

    public TipoEquipoController(TipoEquipoService tipos) {
        this.tipos = tipos;
    }

    @GetMapping
    public List<TipoEquipo> listar() {
        return tipos.listar();
    }

    @RolesPermitidos(Rol.ADMIN)
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TipoEquipo crear(@Valid @RequestBody Solicitudes.TipoEquipoDatos datos) {
        return tipos.crear(datos);
    }

    @RolesPermitidos(Rol.ADMIN)
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        tipos.eliminar(id);
    }
}