import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { DatosService } from '../../services/datos.service';
import { TipoEquipo } from '../../models/modelos';
import { MensajeFeedback } from '../../shared/mensaje-feedback/mensaje-feedback';
import { ConfirmarDialogo } from '../../shared/confirmar-dialogo/confirmar-dialogo';

/** Catálogo de tipos de equipo (laptop, impresora, etc.). Solo el administrador lo mantiene. */
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
    const resultado = this.datos.agregarTipoEquipo(this.nombre);
    if (resultado.error) {
      this.error.set(resultado.error);
      return;
    }
    this.mensaje.set(`Tipo ${this.nombre.trim()} agregado al catálogo.`);
    formulario.resetForm({ nombre: '' });
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
    const resultado = this.datos.eliminarTipoEquipo(tipo.id);
    if (resultado.error) {
      this.error.set(resultado.error);
    } else {
      this.mensaje.set(`Tipo ${tipo.nombre} eliminado.`);
    }
  }
}