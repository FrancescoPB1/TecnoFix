package pe.tecnofix.backend.presentacion;

import java.util.LinkedHashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import pe.tecnofix.backend.negocio.NoAutorizadoException;
import pe.tecnofix.backend.negocio.NoEncontradoException;
import pe.tecnofix.backend.negocio.ProhibidoException;
import pe.tecnofix.backend.negocio.ReglaNegocioException;


@RestControllerAdvice
public class ManejadorErrores {

    private static final Logger registro = LoggerFactory.getLogger(ManejadorErrores.class);

    public record ErrorRespuesta(int estado, String error, String mensaje, Map<String, String> detalles) {
    }

    @ExceptionHandler(ReglaNegocioException.class)
    public ResponseEntity<ErrorRespuesta> reglaDeNegocio(ReglaNegocioException ex) {
        return responder(HttpStatus.CONFLICT, ex.getMessage(), null);
    }

    @ExceptionHandler(NoEncontradoException.class)
    public ResponseEntity<ErrorRespuesta> noEncontrado(NoEncontradoException ex) {
        return responder(HttpStatus.NOT_FOUND, ex.getMessage(), null);
    }

    @ExceptionHandler(NoAutorizadoException.class)
    public ResponseEntity<ErrorRespuesta> noAutorizado(NoAutorizadoException ex) {
        return responder(HttpStatus.UNAUTHORIZED, ex.getMessage(), null);
    }

    @ExceptionHandler(ProhibidoException.class)
    public ResponseEntity<ErrorRespuesta> prohibido(ProhibidoException ex) {
        return responder(HttpStatus.FORBIDDEN, ex.getMessage(), null);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorRespuesta> datosInvalidos(MethodArgumentNotValidException ex) {
        Map<String, String> detalles = new LinkedHashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(error -> detalles.putIfAbsent(error.getField(), error.getDefaultMessage()));
        return responder(HttpStatus.BAD_REQUEST, "Hay datos inválidos en la solicitud.", detalles);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorRespuesta> cuerpoIlegible(HttpMessageNotReadableException ex) {
        return responder(HttpStatus.BAD_REQUEST,
                "El cuerpo de la petición no es un JSON válido o tiene un dato con formato incorrecto.", null);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorRespuesta> parametroIncorrecto(MethodArgumentTypeMismatchException ex) {
        return responder(HttpStatus.BAD_REQUEST, "El parámetro " + ex.getName() + " tiene un formato incorrecto.", null);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorRespuesta> integridad(DataIntegrityViolationException ex) {
        registro.warn("Violación de integridad en la base de datos", ex);
        return responder(HttpStatus.CONFLICT, "No se pudo guardar: el dato ya existe o está en uso.", null);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorRespuesta> inesperado(Exception ex) {
        if (ex instanceof ErrorResponse errorSpring) {
            HttpStatus estado = HttpStatus.valueOf(errorSpring.getStatusCode().value());
            return responder(estado, estado.getReasonPhrase(), null);
        }
        registro.error("Error inesperado", ex);
        return responder(HttpStatus.INTERNAL_SERVER_ERROR, "Ocurrió un error inesperado en el servidor.", null);
    }

    private ResponseEntity<ErrorRespuesta> responder(HttpStatus estado, String mensaje, Map<String, String> detalles) {
        return ResponseEntity.status(estado)
                .body(new ErrorRespuesta(estado.value(), estado.getReasonPhrase(), mensaje, detalles));
    }
}