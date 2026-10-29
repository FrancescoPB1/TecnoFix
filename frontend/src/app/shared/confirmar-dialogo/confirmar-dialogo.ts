import { Component, EventEmitter, Input, Output } from '@angular/core';

/** Cuadro de confirmación para acciones que no se pueden deshacer (aprobar, rechazar, entregar). */
@Component({
  selector: 'app-confirmar-dialogo',
  templateUrl: './confirmar-dialogo.html',
})
export class ConfirmarDialogo {
  @Input() titulo = 'Confirmar acción';
  @Input() mensaje = '';
  @Input() textoConfirmar = 'Confirmar';
  @Output() confirmado = new EventEmitter<void>();
  @Output() cancelado = new EventEmitter<void>();
}