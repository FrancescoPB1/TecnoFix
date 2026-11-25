package pe.tecnofix.backend.negocio;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import pe.tecnofix.backend.modelo.Rol;


public final class Solicitudes {

    private Solicitudes() {
    }

    public record Login(
            @NotBlank(message = "Ingrese el usuario.") String usuario,
            @NotBlank(message = "Ingrese la clave.") String clave) {
    }

    public record SedeDatos(
            @NotBlank(message = "Ingrese el nombre de la sede.")
            @Size(min = 3, max = 60, message = "El nombre debe tener entre 3 y 60 caracteres.") String nombre,
            @NotBlank(message = "Ingrese la ciudad.")
            @Size(min = 2, max = 40, message = "La ciudad debe tener entre 2 y 40 caracteres.") String ciudad,
            @NotBlank(message = "Ingrese el teléfono.")
            @Pattern(regexp = "[0-9]{9}", message = "El teléfono debe tener 9 dígitos.") String telefono) {
    }

    public record TipoEquipoDatos(
            @NotBlank(message = "Ingrese el nombre del tipo.")
            @Size(min = 2, max = 30, message = "El nombre debe tener entre 2 y 30 caracteres.") String nombre) {
    }

    public record PersonalNuevo(
            @NotNull(message = "Seleccione el rol.") Rol rol,
            Long sedeId,
            @NotBlank(message = "Ingrese el nombre.")
            @Size(min = 3, max = 80, message = "El nombre debe tener entre 3 y 80 caracteres.") String nombre,
            @NotBlank(message = "Ingrese el DNI.")
            @Pattern(regexp = "[0-9]{8}", message = "El DNI debe tener 8 dígitos.") String dni,
            @NotBlank(message = "Ingrese el teléfono.")
            @Pattern(regexp = "[0-9]{9}", message = "El teléfono debe tener 9 dígitos.") String telefono,
            @NotBlank(message = "Ingrese el correo.")
            @Email(message = "El correo no es válido.") String correo,
            @Size(max = 60, message = "La especialidad admite hasta 60 caracteres.") String especialidad,
            @NotBlank(message = "Ingrese el usuario.")
            @Pattern(regexp = "[a-z0-9._]{4,20}",
                    message = "El usuario admite de 4 a 20 caracteres: minúsculas, números, punto y guion bajo.") String usuario,
            @NotBlank(message = "Ingrese la clave.")
            @Size(min = 6, max = 40, message = "La clave debe tener entre 6 y 40 caracteres.") String clave) {
    }

    public record PersonalEdicion(
            Long sedeId,
            @NotBlank(message = "Ingrese el nombre.")
            @Size(min = 3, max = 80, message = "El nombre debe tener entre 3 y 80 caracteres.") String nombre,
            @NotBlank(message = "Ingrese el DNI.")
            @Pattern(regexp = "[0-9]{8}", message = "El DNI debe tener 8 dígitos.") String dni,
            @NotBlank(message = "Ingrese el teléfono.")
            @Pattern(regexp = "[0-9]{9}", message = "El teléfono debe tener 9 dígitos.") String telefono,
            @NotBlank(message = "Ingrese el correo.")
            @Email(message = "El correo no es válido.") String correo,
            @Size(max = 60, message = "La especialidad admite hasta 60 caracteres.") String especialidad,
            @Pattern(regexp = "^$|.{6,40}", message = "La clave debe tener entre 6 y 40 caracteres.") String clave) {
    }

    public record ClienteNuevo(
            @NotBlank(message = "Ingrese el DNI.")
            @Pattern(regexp = "[0-9]{8}", message = "El DNI debe tener 8 dígitos.") String dni,
            @NotBlank(message = "Ingrese los nombres.")
            @Size(min = 3, max = 80, message = "Los nombres deben tener entre 3 y 80 caracteres.") String nombres,
            @NotBlank(message = "Ingrese el correo.")
            @Email(message = "El correo no es válido.") String correo,
            @NotBlank(message = "Ingrese el teléfono.")
            @Pattern(regexp = "[0-9]{9}", message = "El teléfono debe tener 9 dígitos.") String telefono) {
    }

    public record ClienteEdicion(
            @NotBlank(message = "Ingrese los nombres.")
            @Size(min = 3, max = 80, message = "Los nombres deben tener entre 3 y 80 caracteres.") String nombres,
            @NotBlank(message = "Ingrese el correo.")
            @Email(message = "El correo no es válido.") String correo,
            @NotBlank(message = "Ingrese el teléfono.")
            @Pattern(regexp = "[0-9]{9}", message = "El teléfono debe tener 9 dígitos.") String telefono) {
    }

   
    public record Recepcion(
            @NotBlank(message = "Ingrese el DNI del cliente.")
            @Pattern(regexp = "[0-9]{8}", message = "El DNI debe tener 8 dígitos.") String dni,
            @Size(max = 80, message = "Los nombres admiten hasta 80 caracteres.") String nombres,
            @Size(max = 80, message = "El correo admite hasta 80 caracteres.") String correo,
            @Pattern(regexp = "^$|[0-9]{9}", message = "El teléfono debe tener 9 dígitos.") String telefono,
            @NotNull(message = "Seleccione el tipo de equipo.") Long tipoId,
            @NotBlank(message = "Ingrese el modelo.")
            @Size(min = 2, max = 60, message = "El modelo debe tener entre 2 y 60 caracteres.") String modelo,
            @NotBlank(message = "Ingrese la serie o IMEI.")
            @Size(min = 5, max = 30, message = "La serie o IMEI debe tener entre 5 y 30 caracteres.") String serie,
            @NotNull(message = "Ingrese la fecha de compra.")
            @PastOrPresent(message = "La fecha de compra no puede ser futura.") LocalDate fechaCompra,
            @NotBlank(message = "Describa la falla.")
            @Size(min = 10, max = 500, message = "La falla debe tener entre 10 y 500 caracteres.") String falla,
            @Size(max = 10, message = "Puede registrar hasta 10 accesorios.") List<String> accesorios) {
    }

    public record Asignacion(
            @NotNull(message = "Seleccione el técnico.") Long tecnicoId) {
    }

    public record Diagnostico(
            @NotBlank(message = "Escriba el diagnóstico.")
            @Size(min = 10, max = 1000, message = "El diagnóstico debe tener entre 10 y 1000 caracteres.") String diagnostico,
            @DecimalMin(value = "0.0", message = "El monto no puede ser negativo.") BigDecimal monto) {
    }

    public record DecisionPresupuesto(
            @NotNull(message = "Indique si aprueba o rechaza el presupuesto.") Boolean aprobado) {
    }

    public record Reparacion(
            @NotBlank(message = "Describa la actividad realizada.")
            @Size(min = 5, max = 500, message = "La actividad debe tener entre 5 y 500 caracteres.") String actividad,
            @Size(max = 300, message = "Los repuestos admiten hasta 300 caracteres.") String repuestos,
            @Size(max = 500, message = "Las pruebas admiten hasta 500 caracteres.") String pruebas,
            boolean terminada) {
    }

   
    public record Entrega(
            @Size(max = 80, message = "El receptor admite hasta 80 caracteres.") String receptor,
            boolean titular,
            List<Long> devueltos,
            @Size(max = 300, message = "Las observaciones admiten hasta 300 caracteres.") String observaciones) {
    }
}