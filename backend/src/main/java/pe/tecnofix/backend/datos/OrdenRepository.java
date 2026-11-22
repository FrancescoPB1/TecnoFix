package pe.tecnofix.backend.datos;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import pe.tecnofix.backend.modelo.EstadoOrden;
import pe.tecnofix.backend.modelo.Orden;

public interface OrdenRepository extends JpaRepository<Orden, Long> {

    List<Orden> findAllByOrderByIdDesc();

    List<Orden> findBySede_IdOrderByIdDesc(Long sedeId);

    List<Orden> findByTecnico_IdOrderByIdDesc(Long tecnicoId);

    List<Orden> findByCliente_IdOrderByIdDesc(Long clienteId);

    boolean existsByEquipo_IdAndEstadoNot(Long equipoId, EstadoOrden estado);

    long countBySede_IdAndEstadoNot(Long sedeId, EstadoOrden estado);
}