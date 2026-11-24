import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { DatosService } from '../../services/datos.service';
import { TipoEquipo } from '../../models/modelos';
import { MensajeFeedback } from '../../shared/mensaje-feedback/mensaje-feedback';
import { ConfirmarDialogo } from '../../shared/confirmar-dialogo/confirmar-dialogo';
import { mensajeDeError } from '../../utils/errores';

@Component({
  selector: 'app-tipos-equipo',
  imports: [FormsModule, MensajeFeedback, ConfirmarDialogo],
  templateUrl: './tipos-equipo.html',
})
export class TiposEquipo {
  readonly datos = inject(DatosService);

  nombre = '';
  readonly mensaje = signal('');
  readonly error = signal('');
  readonly porEliminar = signal<TipoEquipo | null>(null);

  agregar(formulario: NgForm): void {
    this.mensaje.set('');
    this.error.set('');
    if (formulario.invalid) {
      return;
    }
    const nombre = this.nombre.trim();
    this.datos.agregarTipoEquipo(nombre).subscribe({
      next: () => {
        this.mensaje.set(`Tipo ${nombre} agregado al catálogo.`);
        formulario.resetForm({ nombre: '' });
      },
      error: (e) => this.error.set(mensajeDeError(e)),
    });
  }

  pedirEliminar(tipo: TipoEquipo): void {
    this.porEliminar.set(tipo);
  }

  confirmarEliminar(): void {
    const tipo = this.porEliminar();
    this.porEliminar.set(null);
    if (!tipo) {
      return;
    }
    this.mensaje.set('');
    this.error.set('');
    this.datos.eliminarTipoEquipo(tipo.id).subscribe({
      next: () => this.mensaje.set(`Tipo ${tipo.nombre} eliminado.`),
      error: (e) => this.error.set(mensajeDeError(e)),
    });
  }
}