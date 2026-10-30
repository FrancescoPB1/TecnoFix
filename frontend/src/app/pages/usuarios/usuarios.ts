import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { DatosService } from '../../services/datos.service';
import { ETIQUETA_ROL, Rol, Usuario } from '../../models/modelos';
import { MensajeFeedback } from '../../shared/mensaje-feedback/mensaje-feedback';

/** Gestión del personal: el administrador crea las cuentas de recepción y de técnicos. */
@Component({
  selector: 'app-usuarios',
  imports: [FormsModule, MensajeFeedback],
  templateUrl: './usuarios.html',
})
export class Usuarios {
  readonly datos = inject(DatosService);
  readonly etiquetaRol = ETIQUETA_ROL;

  readonly mostrarFormulario = signal(false);
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
    this.nuevo = this.vacio();
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
    const resultado = this.datos.registrarPersonal(this.nuevo);
    if (resultado.error) {
      this.error.set(resultado.error);
      return;
    }
    this.mensaje.set(
      `Usuario ${this.nuevo.usuario} creado (${ETIQUETA_ROL[this.nuevo.rol]}). Entregue el usuario y la clave temporal a la persona.`,
    );
    this.mostrarFormulario.set(false);
  }

  cambiarEstado(usuario: Usuario): void {
    this.datos.cambiarEstadoUsuario(usuario.id);
    this.mensaje.set(
      `La cuenta de ${usuario.nombre} quedó ${usuario.activo ? 'inactiva' : 'activa'}.`,
    );
  }
}