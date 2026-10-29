import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Orden } from '../../models/modelos';

/**
 * Componente hijo: recibe la orden con @Input y avisa la decisión del cliente al
 * componente padre con @Output (true = aprobar, false = rechazar).
 */
@Component({
  selector: 'app-decision-presupuesto',
  templateUrl: './decision-presupuesto.html',
})
export class DecisionPresupuesto {
  @Input({ required: true }) orden!: Orden;
  @Output() decidir = new EventEmitter<boolean>();
}