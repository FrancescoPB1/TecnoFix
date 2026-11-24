import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { DatosService } from '../../services/datos.service';
import { AuthService } from '../../services/auth.service';
import { ETIQUETA_ROL, Rol, Sede, Usuario } from '../../models/modelos';
import { MensajeFeedback } from '../../shared/mensaje-feedback/mensaje-feedback';
import { mensajeDeError } from '../../utils/errores';

@Component({
  selector: 'app-usuarios',
  imports: [FormsModule, MensajeFeedback],
  templateUrl: './usuarios.html',
})
export class Usuarios {
  readonly datos = inject(DatosService);
  private auth = inject(AuthService);
  readonly miId = this.auth.usuario()?.id;
  readonly etiquetaRol = ETIQUETA_ROL;

  readonly mostrarFormulario = signal(false);
  readonly editandoId = signal<number | null>(null);
  readonly mensaje = signal('');
  readonly error = signal('');

  nuevo = this.vacio();

  private vacio() {
    return {
      rol: 'TECNICO' as Rol,
      sedeId: null as number | null,
      nombre: '',
      dni: '',
      telefono: '',
      correo: '',
      especialidad: '',
      usuario: '',
      clave: '',
    };
  }

  abrirFormulario(): void {
    this.mensaje.set('');
    this.error.set('');
    this.editandoId.set(null);
    this.nuevo = this.vacio();
    this.mostrarFormulario.set(true);
  }

  abrirEditar(persona: Usuario): void {
    this.mensaje.set('');
    this.error.set('');
    this.editandoId.set(persona.id);
    this.nuevo = {
      rol: persona.rol,
      sedeId: persona.sedeId ?? null,
      nombre: persona.nombre,
      dni: persona.dni ?? '',
      telefono: persona.telefono ?? '',
      correo: persona.correo ?? '',
      especialidad: persona.especialidad ?? '',
      usuario: persona.usuario,
      clave: '',
    };
    this.mostrarFormulario.set(true);
  }

  sedesDisponibles(): Sede[] {
    return this.datos.sedes().filter((s) => s.activa || s.id === this.nuevo.sedeId);
  }

  cancelar(): void {
    this.mostrarFormulario.set(false);
    this.error.set('');
  }

  guardar(formulario: NgForm): void {
    this.error.set('');
    if (formulario.invalid) {
      return;
    }
    const id = this.editandoId();
    const nombre = this.nuevo.nombre.trim();
    if (id !== null) {
      this.datos.actualizarPersonal(id, this.nuevo).subscribe({
        next: () => {
          this.mensaje.set(`Datos de ${nombre} actualizados.`);
          this.mostrarFormulario.set(false);
        },
        error: (e) => this.error.set(mensajeDeError(e)),
      });
    } else {
      this.datos.registrarPersonal(this.nuevo).subscribe({
        next: (creado) => {
          this.mensaje.set(
            `Usuario ${creado.usuario} creado (${ETIQUETA_ROL[creado.rol]}). Entregue el usuario y la clave temporal a la persona.`,
          );
          this.mostrarFormulario.set(false);
        },
        error: (e) => this.error.set(mensajeDeError(e)),
      });
    }
  }

  cambiarEstado(usuario: Usuario): void {
    this.mensaje.set('');
    this.error.set('');
    this.datos.cambiarEstadoUsuario(usuario.id).subscribe({
      next: (actualizado) =>
        this.mensaje.set(`La cuenta de ${actualizado.nombre} quedó ${actualizado.activo ? 'activa' : 'inactiva'}.`),
      error: (e) => this.error.set(mensajeDeError(e)),
    });
  }
}