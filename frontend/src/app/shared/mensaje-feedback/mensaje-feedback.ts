import { Component, EventEmitter, Input, Output } from '@angular/core';

/** Mensaje de confirmación, error o información que el padre puede cerrar. */
@Component({
  selector: 'app-mensaje-feedback',
  templateUrl: './mensaje-feedback.html',
})
export class MensajeFeedback {
  @Input() texto = '';
  @Input() tipo: 'success' | 'danger' | 'info' = 'info';
  @Output() cerrar = new EventEmitter<void>();
}