import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { DatosService } from '../../services/datos.service';
import { Marca } from '../../models/modelos';
import { MensajeFeedback } from '../../shared/mensaje-feedback/mensaje-feedback';
import { ConfirmarDialogo } from '../../shared/confirmar-dialogo/confirmar-dialogo';

/** Catálogo de marcas de equipos. Solo el administrador lo mantiene. */
@Component({
  selector: 'app-marcas',
  imports: [FormsModule, MensajeFeedback, ConfirmarDialogo],
  templateUrl: './marcas.html',
})
export class Marcas {
  readonly datos = inject(DatosService);

  nombre = '';
  readonly mensaje = signal('');
  readonly error = signal('');
  readonly porEliminar = signal<Marca | null>(null);

  agregar(formulario: NgForm): void {
    this.mensaje.set('');
    this.error.set('');
    if (formulario.invalid) {
      return;
    }
    const resultado = this.datos.agregarMarca(this.nombre);
    if (resultado.error) {
      this.error.set(resultado.error);
      return;
    }
    this.mensaje.set(`Marca ${this.nombre.trim()} agregada al catálogo.`);
    formulario.resetForm({ nombre: '' });
  }

  pedirEliminar(marca: Marca): void {
    this.porEliminar.set(marca);
  }

  confirmarEliminar(): void {
    const marca = this.porEliminar();
    this.porEliminar.set(null);
    if (!marca) {
      return;
    }
    const resultado = this.datos.eliminarMarca(marca.id);
    if (resultado.error) {
      this.error.set(resultado.error);
    } else {
      this.mensaje.set(`Marca ${marca.nombre} eliminada.`);
    }
  }
}