package pe.tecnofix.backend.datos;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import pe.tecnofix.backend.modelo.Equipo;

public interface EquipoRepository extends JpaRepository<Equipo, Long> {

    Optional<Equipo> findByCliente_IdAndSerie(Long clienteId, String serie);

    long countByTipo_Id(Long tipoId);
}