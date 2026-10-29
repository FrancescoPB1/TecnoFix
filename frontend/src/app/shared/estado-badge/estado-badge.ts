import { Component, Input } from '@angular/core';
import { ETIQUETA_ESTADO, EstadoOrden } from '../../models/modelos';

/** Muestra el estado de una orden con texto y color (el estado nunca depende solo del color). */
@Component({
  selector: 'app-estado-badge',
  templateUrl: './estado-badge.html',
})
export class EstadoBadge {
  @Input({ required: true }) estado!: EstadoOrden;

  get etiqueta(): string {
    return ETIQUETA_ESTADO[this.estado];
  }

  get clase(): string {
    switch (this.estado) {
      case 'RECIBIDO':
        return 'text-bg-secondary';
      case 'EN_DIAGNOSTICO':
        return 'text-bg-info';
      case 'PRESUPUESTO_ENVIADO':
        return 'text-bg-warning';
      case 'EN_REPARACION':
        return 'text-bg-primary';
      case 'LISTO_PARA_ENTREGA':
        return 'text-bg-success';
      case 'DEVUELTO_SIN_REPARAR':
        return 'text-bg-danger';
      default:
        return 'text-bg-dark';
    }
  }
}