package pe.tecnofix.backend.seguridad;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Arrays;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;
import pe.tecnofix.backend.negocio.NoAutorizadoException;
import pe.tecnofix.backend.negocio.ProhibidoException;


@Component
public class AuthInterceptor implements HandlerInterceptor {

    public static final String ATRIBUTO_SESION = "sesion";

    private final JwtService jwtService;

    public AuthInterceptor(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        if (!(handler instanceof HandlerMethod metodo)) {
            return true;
        }
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }
        if (metodo.hasMethodAnnotation(Publico.class)) {
            return true;
        }

        String cabecera = request.getHeader("Authorization");
        if (cabecera == null || !cabecera.startsWith("Bearer ")) {
            throw new NoAutorizadoException("Falta el token. Inicie sesión para usar esta operación.");
        }
        UsuarioSesion sesion = jwtService.leer(cabecera.substring(7));

        RolesPermitidos roles = metodo.getMethodAnnotation(RolesPermitidos.class);
        if (roles != null && !Arrays.asList(roles.value()).contains(sesion.rol())) {
            throw new ProhibidoException("Su rol (" + sesion.rol() + ") no puede realizar esta operación.");
        }

        request.setAttribute(ATRIBUTO_SESION, sesion);
        return true;
    }
}