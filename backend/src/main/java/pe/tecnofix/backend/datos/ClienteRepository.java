package pe.tecnofix.backend.datos;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import pe.tecnofix.backend.modelo.Cliente;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    Optional<Cliente> findByDni(String dni);
}