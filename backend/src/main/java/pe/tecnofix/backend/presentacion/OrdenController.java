package pe.tecnofix.backend.presentacion;

import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import pe.tecnofix.backend.modelo.Orden;
import pe.tecnofix.backend.modelo.Rol;
import pe.tecnofix.backend.negocio.OrdenService;
import pe.tecnofix.backend.negocio.Respuestas;
import pe.tecnofix.backend.negocio.Solicitudes;
import pe.tecnofix.backend.seguridad.AuthInterceptor;
import pe.tecnofix.backend.seguridad.RolesPermitidos;
import pe.tecnofix.backend.seguridad.UsuarioSesion;

@RestController
@RequestMapping("/api/ordenes")
public class OrdenController {

    private final OrdenService ordenes;

    public OrdenController(OrdenService ordenes) {
        this.ordenes = ordenes;
    }

    @GetMapping
    public List<Orden> listar(@RequestParam(required = false) Long sedeId,
                              @RequestAttribute(AuthInterceptor.ATRIBUTO_SESION) UsuarioSesion sesion) {
        return ordenes.listar(sesion, sedeId);
    }

    @GetMapping("/{id}")
    public Orden obtener(@PathVariable Long id,
                         @RequestAttribute(AuthInterceptor.ATRIBUTO_SESION) UsuarioSesion sesion) {
        return ordenes.obtener(id, sesion);
    }

    @RolesPermitidos(Rol.RECEPCION)
    @PostMapping("/recepcion")
    @ResponseStatus(HttpStatus.CREATED)
    public Respuestas.RecepcionRespuesta recepcionar(@Valid @RequestBody Solicitudes.Recepcion datos,
                                                     @RequestAttribute(AuthInterceptor.ATRIBUTO_SESION) UsuarioSesion sesion) {
        return ordenes.recepcionar(datos, sesion);
    }

    @RolesPermitidos({Rol.ADMIN, Rol.RECEPCION})
    @PatchMapping("/{id}/asignacion")
    public Orden asignar(@PathVariable Long id, @Valid @RequestBody Solicitudes.Asignacion datos,
                         @RequestAttribute(AuthInterceptor.ATRIBUTO_SESION) UsuarioSesion sesion) {
        return ordenes.asignar(id, datos, sesion);
    }

    @RolesPermitidos(Rol.TECNICO)
    @PatchMapping("/{id}/diagnostico")
    public Orden diagnosticar(@PathVariable Long id, @Valid @RequestBody Solicitudes.Diagnostico datos,
                              @RequestAttribute(AuthInterceptor.ATRIBUTO_SESION) UsuarioSesion sesion) {
        return ordenes.diagnosticar(id, datos, sesion);
    }

    @RolesPermitidos(Rol.CLIENTE)
    @PatchMapping("/{id}/decision")
    public Orden decidir(@PathVariable Long id, @Valid @RequestBody Solicitudes.DecisionPresupuesto datos,
                         @RequestAttribute(AuthInterceptor.ATRIBUTO_SESION) UsuarioSesion sesion) {
        return ordenes.decidir(id, datos, sesion);
    }

    @RolesPermitidos(Rol.TECNICO)
    @PatchMapping("/{id}/reparacion")
    public Orden reparar(@PathVariable Long id, @Valid @RequestBody Solicitudes.Reparacion datos,
                         @RequestAttribute(AuthInterceptor.ATRIBUTO_SESION) UsuarioSesion sesion) {
        return ordenes.reparar(id, datos, sesion);
    }

    @RolesPermitidos(Rol.RECEPCION)
    @PatchMapping("/{id}/entrega")
    public Orden entregar(@PathVariable Long id, @Valid @RequestBody Solicitudes.Entrega datos,
                          @RequestAttribute(AuthInterceptor.ATRIBUTO_SESION) UsuarioSesion sesion) {
        return ordenes.entregar(id, datos, sesion);
    }
}