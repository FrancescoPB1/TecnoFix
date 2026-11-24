import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { DatosService } from '../../services/datos.service';
import { Sede } from '../../models/modelos';
import { MensajeFeedback } from '../../shared/mensaje-feedback/mensaje-feedback';
import { mensajeDeError } from '../../utils/errores';

@Component({
  selector: 'app-sedes',
  imports: [FormsModule, MensajeFeedback],
  templateUrl: './sedes.html',
})
export class Sedes {
  readonly datos = inject(DatosService);

  readonly editandoId = signal<number | null>(null);
  readonly mensaje = signal('');
  readonly error = signal('');

  sede = { nombre: '', ciudad: '', telefono: '' };

  editar(sede: Sede): void {
    this.mensaje.set('');
    this.error.set('');
    this.editandoId.set(sede.id);
    this.sede = { nombre: sede.nombre, ciudad: sede.ciudad, telefono: sede.telefono };
  }

  cancelar(formulario: NgForm): void {
    this.editandoId.set(null);
    this.error.set('');
    formulario.resetForm({ nombre: '', ciudad: '', telefono: '' });
  }

  guardar(formulario: NgForm): void {
    this.mensaje.set('');
    this.error.set('');
    if (formulario.invalid) {
      return;
    }
    const id = this.editandoId();
    const nombre = this.sede.nombre.trim();
    const peticion = id === null ? this.datos.agregarSede(this.sede) : this.datos.actualizarSede(id, this.sede);
    peticion.subscribe({
      next: () => {
        this.mensaje.set(id === null ? `Sede ${nombre} registrada.` : `Datos de la sede ${nombre} actualizados.`);
        this.editandoId.set(null);
        formulario.resetForm({ nombre: '', ciudad: '', telefono: '' });
      },
      error: (e) => this.error.set(mensajeDeError(e)),
    });
  }

  cambiarEstado(sede: Sede): void {
    this.mensaje.set('');
    this.error.set('');
    this.datos.cambiarEstadoSede(sede.id).subscribe({
      next: (actualizada) =>
        this.mensaje.set(`La sede ${actualizada.nombre} quedó ${actualizada.activa ? 'activa' : 'inactiva'}.`),
      error: (e) => this.error.set(mensajeDeError(e)),
    });
  }
}