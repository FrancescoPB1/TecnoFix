package pe.tecnofix.backend.datos;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.tecnofix.backend.modelo.Sede;

public interface SedeRepository extends JpaRepository<Sede, Long> {

    boolean existsByNombreIgnoreCase(String nombre);

    boolean existsByNombreIgnoreCaseAndIdNot(String nombre, Long id);
}