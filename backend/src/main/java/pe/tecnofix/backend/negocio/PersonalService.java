package pe.tecnofix.backend.negocio;

import java.util.List;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pe.tecnofix.backend.datos.UsuarioRepository;
import pe.tecnofix.backend.modelo.Rol;
import pe.tecnofix.backend.modelo.Sede;
import pe.tecnofix.backend.modelo.Usuario;

@Service
@Transactional
public class PersonalService {

    private final UsuarioRepository usuarios;
    private final SedeService sedeService;
    private final BCryptPasswordEncoder codificador;

    public PersonalService(UsuarioRepository usuarios, SedeService sedeService, BCryptPasswordEncoder codificador) {
        this.usuarios = usuarios;
        this.sedeService = sedeService;
        this.codificador = codificador;
    }

    public List<Usuario> listar() {
        return usuarios.findByRolNotOrderByIdAsc(Rol.CLIENTE);
    }

    public List<Usuario> tecnicos(Long sedeId) {
        if (sedeId == null) {
            return usuarios.findByRolAndActivoTrueOrderByIdAsc(Rol.TECNICO);
        }
        return usuarios.findByRolAndActivoTrueAndSede_IdOrderByIdAsc(Rol.TECNICO, sedeId);
    }

    public Usuario registrar(Solicitudes.PersonalNuevo datos) {
        if (datos.rol() == Rol.CLIENTE) {
            throw new ReglaNegocioException("Los clientes se registran desde la recepción de equipos.");
        }
        String usuario = datos.usuario().trim();
        if (usuarios.existsByUsuarioIgnoreCase(usuario)) {
            throw new ReglaNegocioException("El usuario " + usuario + " ya existe.");
        }
        if (usuarios.existsByDniAndRolNot(datos.dni(), Rol.CLIENTE)) {
            throw new ReglaNegocioException("Ya hay una persona del personal registrada con ese DNI.");
        }
        Usuario nuevo = new Usuario();
        nuevo.setRol(datos.rol());
        nuevo.setUsuario(usuario);
        nuevo.setClave(codificador.encode(datos.clave()));
        nuevo.setActivo(true);
        copiarDatos(nuevo, datos.sedeId(), datos.nombre(), datos.dni(), datos.telefono(), datos.correo(), datos.especialidad());
        return usuarios.save(nuevo);
    }

    public Usuario actualizar(Long id, Solicitudes.PersonalEdicion datos) {
        Usuario personal = obtenerPersonal(id);
        if (usuarios.existsByDniAndRolNotAndIdNot(datos.dni(), Rol.CLIENTE, id)) {
            throw new ReglaNegocioException("Ya hay una persona del personal registrada con ese DNI.");
        }
        copiarDatos(personal, datos.sedeId(), datos.nombre(), datos.dni(), datos.telefono(), datos.correo(), datos.especialidad());
        if (datos.clave() != null && !datos.clave().isEmpty()) {
            personal.setClave(codificador.encode(datos.clave()));
        }
        return usuarios.save(personal);
    }

    public Usuario cambiarEstado(Long id) {
        Usuario personal = obtenerPersonal(id);
        personal.setActivo(!personal.isActivo());
        return usuarios.save(personal);
    }

    private Usuario obtenerPersonal(Long id) {
        Usuario usuario = usuarios.findById(id)
                .orElseThrow(() -> new NoEncontradoException("El usuario " + id + " no existe."));
        if (usuario.getRol() == Rol.CLIENTE) {
            throw new NoEncontradoException("El usuario " + id + " no es parte del personal.");
        }
        return usuario;
    }

    private void copiarDatos(Usuario usuario, Long sedeId, String nombre, String dni, String telefono,
                             String correo, String especialidad) {
        if (usuario.getRol() == Rol.ADMIN) {
            usuario.setSede(null);
        } else {
            if (sedeId == null) {
                throw new ReglaNegocioException("Seleccione la sede donde trabaja.");
            }
            Sede sede = sedeService.obtener(sedeId);
            if (!sede.isActiva()) {
                throw new ReglaNegocioException("La sede " + sede.getNombre() + " está desactivada.");
            }
            usuario.setSede(sede);
        }
        usuario.setNombre(nombre.trim());
        usuario.setDni(dni);
        usuario.setTelefono(telefono);
        usuario.setCorreo(correo.trim());
        boolean esTecnico = usuario.getRol() == Rol.TECNICO;
        usuario.setEspecialidad(esTecnico && especialidad != null ? especialidad.trim() : null);
    }
}