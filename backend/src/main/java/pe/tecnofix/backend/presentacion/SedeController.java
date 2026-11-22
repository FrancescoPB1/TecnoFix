package pe.tecnofix.backend.presentacion;

import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import pe.tecnofix.backend.modelo.Rol;
import pe.tecnofix.backend.modelo.Sede;
import pe.tecnofix.backend.negocio.SedeService;
import pe.tecnofix.backend.negocio.Solicitudes;
import pe.tecnofix.backend.seguridad.RolesPermitidos;

@RestController
@RequestMapping("/api/sedes")
public class SedeController {

    private final SedeService sedes;

    public SedeController(SedeService sedes) {
        this.sedes = sedes;
    }

    @GetMapping
    public List<Sede> listar() {
        return sedes.listar();
    }

    @GetMapping("/{id}")
    public Sede obtener(@PathVariable Long id) {
        return sedes.obtener(id);
    }

    @RolesPermitidos(Rol.ADMIN)
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Sede crear(@Valid @RequestBody Solicitudes.SedeDatos datos) {
        return sedes.crear(datos);
    }

    @RolesPermitidos(Rol.ADMIN)
    @PutMapping("/{id}")
    public Sede actualizar(@PathVariable Long id, @Valid @RequestBody Solicitudes.SedeDatos datos) {
        return sedes.actualizar(id, datos);
    }

    @RolesPermitidos(Rol.ADMIN)
    @PatchMapping("/{id}/estado")
    public Sede cambiarEstado(@PathVariable Long id) {
        return sedes.cambiarEstado(id);
    }
}