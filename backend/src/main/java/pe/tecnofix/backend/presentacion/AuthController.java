package pe.tecnofix.backend.presentacion;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pe.tecnofix.backend.negocio.AutenticacionService;
import pe.tecnofix.backend.negocio.Respuestas;
import pe.tecnofix.backend.negocio.Solicitudes;
import pe.tecnofix.backend.seguridad.AuthInterceptor;
import pe.tecnofix.backend.seguridad.Publico;
import pe.tecnofix.backend.seguridad.UsuarioSesion;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AutenticacionService autenticacion;

    public AuthController(AutenticacionService autenticacion) {
        this.autenticacion = autenticacion;
    }

    @Publico
    @PostMapping("/login")
    public Respuestas.LoginRespuesta login(@Valid @RequestBody Solicitudes.Login solicitud) {
        return autenticacion.iniciarSesion(solicitud);
    }

    @GetMapping("/yo")
    public UsuarioSesion yo(@RequestAttribute(AuthInterceptor.ATRIBUTO_SESION) UsuarioSesion sesion) {
        return sesion;
    }
}