package pe.tecnofix.backend.datos;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.tecnofix.backend.modelo.TipoEquipo;

public interface TipoEquipoRepository extends JpaRepository<TipoEquipo, Long> {

    boolean existsByNombreIgnoreCase(String nombre);
}