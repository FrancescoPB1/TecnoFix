import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { DatosService } from '../../services/datos.service';
import { AuthService } from '../../services/auth.service';
import { Cliente } from '../../models/modelos';
import { MensajeFeedback } from '../../shared/mensaje-feedback/mensaje-feedback';
import { ConfirmarDialogo } from '../../shared/confirmar-dialogo/confirmar-dialogo';

/**
 * Clientes registrados. Recepción los registra y corrige sus datos; el administrador solo los consulta.
 * Al registrar un cliente se crea su acceso (usuario = DNI y una clave temporal).
 */
@Component({
  selector: 'app-clientes',
  imports: [FormsModule, MensajeFeedback, ConfirmarDialogo],
  templateUrl: './clientes.html',
})
export class Clientes {
  readonly datos = inject(DatosService);
  private auth = inject(AuthService);

  // Solo recepción registra y modifica clientes.
  readonly esRecepcion = this.auth.usuario()?.rol === 'RECEPCION';

  readonly texto = signal('');
  readonly mostrarFormulario = signal(false);
  readonly editandoId = signal<number | null>(null);
  readonly mensaje = signal('');
  readonly error = signal('');
  readonly porRestablecer = signal<Cliente | null>(null);

  form = this.vacio();

  readonly clientesFiltrados = computed(() => {
    const busqueda = this.texto().trim().toLowerCase();
    return this.datos
      .clientes()
      .filter((c) => !busqueda || `${c.dni} ${c.nombres}`.toLowerCase().includes(busqueda));
  });

  private vacio() {
    return { dni: '', nombres: '', correo: '', telefono: '' };
  }

  abrirNuevo(): void {
    this.mensaje.set('');
    this.error.set('');
    this.editandoId.set(null);
    this.form = this.vacio();
    this.mostrarFormulario.set(true);
  }

  abrirEditar(cliente: Cliente): void {
    this.mensaje.set('');
    this.error.set('');
    this.editandoId.set(cliente.id);
    this.form = {
      dni: cliente.dni,
      nombres: cliente.nombres,
      correo: cliente.correo,
      telefono: cliente.telefono,
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
      this.datos.actualizarCliente(id, this.form);
      this.mensaje.set(`Datos de ${this.form.nombres.trim()} actualizados.`);
    } else {
      const resultado = this.datos.crearCliente(this.form);
      if (resultado.error) {
        this.error.set(resultado.error);
        return;
      }
      this.mensaje.set(
        `Cliente registrado. Entréguele su acceso: usuario ${resultado.acceso!.usuario} y clave temporal ${resultado.acceso!.clave}.`,
      );
    }
    this.mostrarFormulario.set(false);
  }

  pedirRestablecer(cliente: Cliente): void {
    this.porRestablecer.set(cliente);
  }

  confirmarRestablecer(): void {
    const cliente = this.porRestablecer();
    this.porRestablecer.set(null);
    if (!cliente) {
      return;
    }
    const acceso = this.datos.restablecerClaveCliente(cliente.id);
    if (acceso) {
      this.mensaje.set(
        `Clave restablecida para ${cliente.nombres}: usuario ${acceso.usuario} y clave temporal ${acceso.clave}.`,
      );
    }
  }
}