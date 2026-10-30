import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { DatosService } from '../../services/datos.service';
import { AuthService } from '../../services/auth.service';
import { ETIQUETA_ROL, Rol, Usuario } from '../../models/modelos';
import { MensajeFeedback } from '../../shared/mensaje-feedback/mensaje-feedback';

/** Gestión del personal: el administrador crea y corrige las cuentas de administradores, recepción y técnicos. */
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
  // Id de la cuenta que se está editando (null cuando se crea una nueva).
  readonly editandoId = signal<number | null>(null);
  readonly mensaje = signal('');
  readonly error = signal('');

  nuevo = this.vacio();

  private vacio() {
    return {
      rol: 'TECNICO' as Rol,
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
    if (id !== null) {
      const cambio = this.datos.actualizarPersonal(id, this.nuevo);
      if (cambio.error) {
        this.error.set(cambio.error);
        return;
      }
      this.mensaje.set(`Datos de ${this.nuevo.nombre.trim()} actualizados.`);
    } else {
      const resultado = this.datos.registrarPersonal(this.nuevo);
      if (resultado.error) {
        this.error.set(resultado.error);
        return;
      }
      this.mensaje.set(
        `Usuario ${this.nuevo.usuario} creado (${ETIQUETA_ROL[this.nuevo.rol]}). Entregue el usuario y la clave temporal a la persona.`,
      );
    }
    this.mostrarFormulario.set(false);
  }

  cambiarEstado(usuario: Usuario): void {
    this.datos.cambiarEstadoUsuario(usuario.id);
    this.mensaje.set(
      `La cuenta de ${usuario.nombre} quedó ${usuario.activo ? 'inactiva' : 'activa'}.`,
    );
  }
}