package pe.tecnofix.backend.modelo;

public enum EstadoOrden {
    RECIBIDO,
    EN_DIAGNOSTICO,
    PRESUPUESTO_ENVIADO,
    EN_REPARACION,
    LISTO_PARA_ENTREGA,
    ENTREGADO,
    DEVUELTO_SIN_REPARAR
}