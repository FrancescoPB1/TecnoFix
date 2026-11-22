package pe.tecnofix.backend.datos;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import pe.tecnofix.backend.modelo.Rol;
import pe.tecnofix.backend.modelo.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByUsuarioIgnoreCase(String usuario);

    boolean existsByUsuarioIgnoreCase(String usuario);

    Optional<Usuario> findByCliente_Id(Long clienteId);

    List<Usuario> findByRolNotOrderByIdAsc(Rol rol);

    boolean existsByDniAndRolNot(String dni, Rol rol);

    boolean existsByDniAndRolNotAndIdNot(String dni, Rol rol, Long id);

    List<Usuario> findByRolAndActivoTrueOrderByIdAsc(Rol rol);

    List<Usuario> findByRolAndActivoTrueAndSede_IdOrderByIdAsc(Rol rol, Long sedeId);

    long countBySede_Id(Long sedeId);
}