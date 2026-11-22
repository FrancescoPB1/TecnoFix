package pe.tecnofix.backend.negocio;

import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pe.tecnofix.backend.datos.ClienteRepository;
import pe.tecnofix.backend.datos.UsuarioRepository;
import pe.tecnofix.backend.modelo.Cliente;
import pe.tecnofix.backend.modelo.Rol;
import pe.tecnofix.backend.modelo.Usuario;

@Service
@Transactional
public class ClienteService {

    private final ClienteRepository clientes;
    private final UsuarioRepository usuarios;
    private final BCryptPasswordEncoder codificador;

    public ClienteService(ClienteRepository clientes, UsuarioRepository usuarios, BCryptPasswordEncoder codificador) {
        this.clientes = clientes;
        this.usuarios = usuarios;
        this.codificador = codificador;
    }

    public List<Cliente> listar() {
        return clientes.findAll(Sort.by("id"));
    }

    public Cliente obtener(Long id) {
        return clientes.findById(id).orElseThrow(() -> new NoEncontradoException("El cliente " + id + " no existe."));
    }

    public Cliente buscarPorDni(String dni) {
        return clientes.findByDni(dni)
                .orElseThrow(() -> new NoEncontradoException("No hay un cliente con el DNI " + dni + "."));
    }

    public Respuestas.ClienteConAcceso crear(Solicitudes.ClienteNuevo datos) {
        return crear(datos.dni(), datos.nombres(), datos.correo(), datos.telefono());
    }

    public Respuestas.ClienteConAcceso crear(String dni, String nombres, String correo, String telefono) {
        if (clientes.findByDni(dni).isPresent()) {
            throw new ReglaNegocioException("Ya existe un cliente con el DNI " + dni + ".");
        }
        if (usuarios.existsByUsuarioIgnoreCase(dni)) {
            throw new ReglaNegocioException("El usuario " + dni + " ya existe en el sistema.");
        }
        Cliente cliente = new Cliente();
        cliente.setDni(dni);
        cliente.setNombres(nombres.trim());
        cliente.setCorreo(correo.trim());
        cliente.setTelefono(telefono);
        cliente = clientes.save(cliente);

        String clave = claveTemporal(dni);
        Usuario acceso = new Usuario();
        acceso.setNombre(cliente.getNombres());
        acceso.setUsuario(dni);
        acceso.setClave(codificador.encode(clave));
        acceso.setRol(Rol.CLIENTE);
        acceso.setActivo(true);
        acceso.setCliente(cliente);
        usuarios.save(acceso);

        return new Respuestas.ClienteConAcceso(cliente, new Respuestas.AccesoCliente(dni, clave));
    }

    public Cliente actualizar(Long id, Solicitudes.ClienteEdicion datos) {
        Cliente cliente = obtener(id);
        cliente.setNombres(datos.nombres().trim());
        cliente.setCorreo(datos.correo().trim());
        cliente.setTelefono(datos.telefono());
        usuarios.findByCliente_Id(id).ifPresent(acceso -> {
            acceso.setNombre(cliente.getNombres());
            usuarios.save(acceso);
        });
        return clientes.save(cliente);
    }

    public Respuestas.AccesoCliente restablecerClave(Long id) {
        Cliente cliente = obtener(id);
        Usuario acceso = usuarios.findByCliente_Id(id)
                .orElseThrow(() -> new NoEncontradoException("El cliente no tiene acceso registrado."));
        String clave = claveTemporal(cliente.getDni());
        acceso.setClave(codificador.encode(clave));
        usuarios.save(acceso);
        return new Respuestas.AccesoCliente(acceso.getUsuario(), clave);
    }

    private String claveTemporal(String dni) {
        return "tf" + dni.substring(dni.length() - 4);
    }
}