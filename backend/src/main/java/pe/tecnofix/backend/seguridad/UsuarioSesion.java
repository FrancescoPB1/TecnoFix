package pe.tecnofix.backend.seguridad;

import pe.tecnofix.backend.modelo.Rol;

public record UsuarioSesion(Long id, String usuario, String nombre, Rol rol, Long sedeId, Long clienteId) {
}