import { HttpErrorResponse } from '@angular/common/http';

interface ErrorApi {
  estado: number;
  error: string;
  mensaje: string;
  detalles?: Record<string, string> | null;
}


export function mensajeDeError(error: unknown): string {
  if (!(error instanceof HttpErrorResponse)) {
    return 'Ocurrió un error inesperado.';
  }
  if (error.status === 0) {
    return 'No hay conexión con el servidor. Verifique que la API esté en ejecución.';
  }
  const cuerpo = error.error as ErrorApi | null;
  if (error.status === 400 && cuerpo?.detalles) {
    const mensajes = Object.values(cuerpo.detalles);
    if (mensajes.length > 0) {
      return mensajes.join(' ');
    }
  }
  if (cuerpo?.mensaje) {
    return cuerpo.mensaje;
  }
  if (error.status >= 500) {
    return 'Ocurrió un error en el servidor. Intente nuevamente.';
  }
  return `No se pudo completar la operación (error ${error.status}).`;
}