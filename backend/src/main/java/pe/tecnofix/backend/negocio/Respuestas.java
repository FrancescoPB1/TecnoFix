package pe.tecnofix.backend.negocio;

import pe.tecnofix.backend.modelo.Cliente;
import pe.tecnofix.backend.modelo.Orden;
import pe.tecnofix.backend.modelo.Usuario;

public final class Respuestas {

    private Respuestas() {
    }

    public record AccesoCliente(String usuario, String clave) {
    }

    public record ClienteConAcceso(Cliente cliente, AccesoCliente acceso) {
    }

    public record RecepcionRespuesta(Orden orden, AccesoCliente accesoCliente) {
    }

    public record LoginRespuesta(String token, Usuario usuario) {
    }
}