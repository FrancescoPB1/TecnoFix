// Modelos de datos del prototipo TecnoFix.

export type Rol = 'ADMIN' | 'TECNICO' | 'CLIENTE';

export type EstadoOrden =
  | 'RECIBIDO'
  | 'EN_DIAGNOSTICO'
  | 'PRESUPUESTO_ENVIADO'
  | 'EN_REPARACION'
  | 'LISTO_PARA_ENTREGA'
  | 'ENTREGADO'
  | 'DEVUELTO_SIN_REPARAR';

export const ETIQUETA_ESTADO: Record<EstadoOrden, string> = {
  RECIBIDO: 'Recibido',
  EN_DIAGNOSTICO: 'En diagnóstico',
  PRESUPUESTO_ENVIADO: 'Presupuesto enviado',
  EN_REPARACION: 'En reparación',
  LISTO_PARA_ENTREGA: 'Listo para entrega',
  ENTREGADO: 'Entregado',
  DEVUELTO_SIN_REPARAR: 'Devolución sin reparar',
};

export interface Usuario {
  id: number;
  nombre: string;
  usuario: string;
  clave: string;
  rol: Rol;
  clienteId?: number;
}

export interface Cliente {
  id: number;
  dni: string;
  nombres: string;
  correo: string;
  telefono: string;
}

export interface Equipo {
  id: number;
  clienteId: number;
  tipo: string;
  marca: string;
  modelo: string;
  serie: string;
}

export interface MovimientoOrden {
  fecha: string;
  estado: EstadoOrden;
  responsable: string;
  detalle: string;
}

export interface Orden {
  id: number;
  codigo: string;
  clienteId: number;
  equipoId: number;
  tecnicoId?: number;
  falla: string;
  accesorios: string;
  estado: EstadoOrden;
  diagnostico?: string;
  montoPresupuesto?: number;
  decision?: 'APROBADO' | 'RECHAZADO';
  actividad?: string;
  repuestos?: string;
  pruebas?: string;
  receptor?: string;
  accesoriosDevueltos?: string;
  observacionesEntrega?: string;
  historial: MovimientoOrden[];
}