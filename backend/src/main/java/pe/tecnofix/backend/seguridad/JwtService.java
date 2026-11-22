package pe.tecnofix.backend.seguridad;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import pe.tecnofix.backend.modelo.Rol;
import pe.tecnofix.backend.modelo.Usuario;
import pe.tecnofix.backend.negocio.NoAutorizadoException;

@Service
public class JwtService {

    private final SecretKey clave;
    private final long horasDeVida;

    public JwtService(@Value("${tecnofix.jwt.secreto}") String secreto,
                      @Value("${tecnofix.jwt.horas}") long horasDeVida) {
        this.clave = Keys.hmacShaKeyFor(secreto.getBytes(StandardCharsets.UTF_8));
        this.horasDeVida = horasDeVida;
    }

    public String generar(Usuario usuario) {
        Date ahora = new Date();
        Date vence = new Date(ahora.getTime() + horasDeVida * 3600L * 1000L);
        return Jwts.builder()
                .subject(usuario.getUsuario())
                .claim("id", usuario.getId())
                .claim("nombre", usuario.getNombre())
                .claim("rol", usuario.getRol().name())
                .claim("sedeId", usuario.getSedeId())
                .claim("clienteId", usuario.getClienteId())
                .issuedAt(ahora)
                .expiration(vence)
                .signWith(clave)
                .compact();
    }

    public UsuarioSesion leer(String token) {
        try {
            Claims datos = Jwts.parser().verifyWith(clave).build().parseSignedClaims(token).getPayload();
            return new UsuarioSesion(
                    numero(datos.get("id")),
                    datos.getSubject(),
                    datos.get("nombre", String.class),
                    Rol.valueOf(datos.get("rol", String.class)),
                    numero(datos.get("sedeId")),
                    numero(datos.get("clienteId")));
        } catch (JwtException | IllegalArgumentException e) {
            throw new NoAutorizadoException("El token no es válido o ya venció. Inicie sesión otra vez.");
        }
    }

    private Long numero(Object valor) {
        return valor == null ? null : ((Number) valor).longValue();
    }
}