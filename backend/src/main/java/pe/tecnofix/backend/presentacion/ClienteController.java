package pe.tecnofix.backend.presentacion;

import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import pe.tecnofix.backend.modelo.Cliente;
import pe.tecnofix.backend.modelo.Rol;
import pe.tecnofix.backend.negocio.ClienteService;
import pe.tecnofix.backend.negocio.Respuestas;
import pe.tecnofix.backend.negocio.Solicitudes;
import pe.tecnofix.backend.seguridad.RolesPermitidos;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    private final ClienteService clientes;

    public ClienteController(ClienteService clientes) {
        this.clientes = clientes;
    }

    @RolesPermitidos({Rol.ADMIN, Rol.RECEPCION})
    @GetMapping
    public List<Cliente> listar() {
        return clientes.listar();
    }

    @RolesPermitidos({Rol.ADMIN, Rol.RECEPCION})
    @GetMapping("/{id}")
    public Cliente obtener(@PathVariable Long id) {
        return clientes.obtener(id);
    }

    @RolesPermitidos({Rol.ADMIN, Rol.RECEPCION})
    @GetMapping("/dni/{dni}")
    public Cliente buscarPorDni(@PathVariable String dni) {
        return clientes.buscarPorDni(dni);
    }

    @RolesPermitidos({Rol.ADMIN, Rol.RECEPCION})
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Respuestas.ClienteConAcceso crear(@Valid @RequestBody Solicitudes.ClienteNuevo datos) {
        return clientes.crear(datos);
    }

    @RolesPermitidos({Rol.ADMIN, Rol.RECEPCION})
    @PutMapping("/{id}")
    public Cliente actualizar(@PathVariable Long id, @Valid @RequestBody Solicitudes.ClienteEdicion datos) {
        return clientes.actualizar(id, datos);
    }

    @RolesPermitidos({Rol.ADMIN, Rol.RECEPCION})
    @PostMapping("/{id}/restablecer-clave")
    public Respuestas.AccesoCliente restablecerClave(@PathVariable Long id) {
        return clientes.restablecerClave(id);
    }
}