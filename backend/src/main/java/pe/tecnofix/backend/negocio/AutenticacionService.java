package pe.tecnofix.backend.negocio;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import pe.tecnofix.backend.datos.UsuarioRepository;
import pe.tecnofix.backend.modelo.Usuario;
import pe.tecnofix.backend.seguridad.JwtService;

@Service
public class AutenticacionService {

    private final UsuarioRepository usuarios;
    private final BCryptPasswordEncoder codificador;
    private final JwtService jwtService;

    public AutenticacionService(UsuarioRepository usuarios, BCryptPasswordEncoder codificador, JwtService jwtService) {
        this.usuarios = usuarios;
        this.codificador = codificador;
        this.jwtService = jwtService;
    }

    public Respuestas.LoginRespuesta iniciarSesion(Solicitudes.Login solicitud) {
        Usuario usuario = usuarios.findByUsuarioIgnoreCase(solicitud.usuario().trim())
                .orElseThrow(() -> new NoAutorizadoException("Usuario o clave incorrectos."));
        if (!codificador.matches(solicitud.clave(), usuario.getClave())) {
            throw new NoAutorizadoException("Usuario o clave incorrectos.");
        }
        if (!usuario.isActivo()) {
            throw new ProhibidoException("La cuenta está desactivada. Consulte con el administrador.");
        }
        return new Respuestas.LoginRespuesta(jwtService.generar(usuario), usuario);
    }
}