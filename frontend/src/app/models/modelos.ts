// Modelos de datos del prototipo TecnoFix.

export type Rol = 'ADMIN' | 'RECEPCION' | 'TECNICO' | 'CLIENTE';

export const ETIQUETA_ROL: Record<Rol, string> = {
  ADMIN: 'Administrador',
  RECEPCION: 'Recepción',
  TECNICO: 'Técnico',
  CLIENTE: 'Cliente',
};

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
  DEVUELTO_SIN_REPARAR: 'Devuelto sin reparar',
};

export interface Usuario {
  id: number;
  nombre: string;
  usuario: string;
  clave?: string;
  rol: Rol;
  activo: boolean;
  clienteId?: number;
  sedeId?: number;
  dni?: string;
  telefono?: string;
  correo?: string;
  especialidad?: string;
}

export interface Sede {
  id: number;
  nombre: string;
  ciudad: string;
  telefono: string;
  activa: boolean;
}

export interface TipoEquipo {
  id: number;
  nombre: string;
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
  tipoId: number;
  modelo: string;
  serie: string;
  fechaCompra: string;
  tipoNombre?: string;
}

export const MESES_GARANTIA = 12;

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
  sedeId: number;
  tecnicoId?: number;
  clienteNombre?: string;
  sedeNombre?: string;
  tecnicoNombre?: string;
  equipo?: Equipo;
  enGarantia: boolean;
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