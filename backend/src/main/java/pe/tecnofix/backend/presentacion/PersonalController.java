package pe.tecnofix.backend.presentacion;

import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import pe.tecnofix.backend.modelo.Rol;
import pe.tecnofix.backend.modelo.Usuario;
import pe.tecnofix.backend.negocio.PersonalService;
import pe.tecnofix.backend.negocio.Solicitudes;
import pe.tecnofix.backend.seguridad.AuthInterceptor;
import pe.tecnofix.backend.seguridad.RolesPermitidos;
import pe.tecnofix.backend.seguridad.UsuarioSesion;

@RestController
@RequestMapping("/api/usuarios")
public class PersonalController {

    private final PersonalService personal;

    public PersonalController(PersonalService personal) {
        this.personal = personal;
    }

    @RolesPermitidos(Rol.ADMIN)
    @GetMapping
    public List<Usuario> listar() {
        return personal.listar();
    }

    @RolesPermitidos({Rol.ADMIN, Rol.RECEPCION})
    @GetMapping("/tecnicos")
    public List<Usuario> tecnicos(@RequestParam(required = false) Long sedeId,
                                  @RequestAttribute(AuthInterceptor.ATRIBUTO_SESION) UsuarioSesion sesion) {
        Long sede = sesion.rol() == Rol.RECEPCION ? sesion.sedeId() : sedeId;
        return personal.tecnicos(sede);
    }

    @RolesPermitidos(Rol.ADMIN)
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Usuario registrar(@Valid @RequestBody Solicitudes.PersonalNuevo datos) {
        return personal.registrar(datos);
    }

    @RolesPermitidos(Rol.ADMIN)
    @PutMapping("/{id}")
    public Usuario actualizar(@PathVariable Long id, @Valid @RequestBody Solicitudes.PersonalEdicion datos) {
        return personal.actualizar(id, datos);
    }

    @RolesPermitidos(Rol.ADMIN)
    @PatchMapping("/{id}/estado")
    public Usuario cambiarEstado(@PathVariable Long id) {
        return personal.cambiarEstado(id);
    }
}