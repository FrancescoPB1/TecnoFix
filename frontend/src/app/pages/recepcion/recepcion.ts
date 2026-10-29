import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DatosService } from '../../services/datos.service';
import { AuthService } from '../../services/auth.service';
import { Cliente } from '../../models/modelos';
import { MensajeFeedback } from '../../shared/mensaje-feedback/mensaje-feedback';

@Component({
  selector: 'app-recepcion',
  imports: [FormsModule, RouterLink, MensajeFeedback],
  templateUrl: './recepcion.html',
})
export class Recepcion {
  private datos = inject(DatosService);
  private auth = inject(AuthService);
  private router = inject(Router);

  readonly tipos = ['Laptop', 'PC de escritorio', 'Impresora', 'Monitor', 'Otro'];

  dni = '';
  nuevoCliente = { nombres: '', correo: '', telefono: '' };
  equipo = { tipo: 'Laptop', marca: '', modelo: '', serie: '' };
  falla = '';
  accesorios = '';

  readonly clienteEncontrado = signal<Cliente | null>(null);
  readonly busquedaHecha = signal(false);
  readonly error = signal('');
  readonly codigoCreado = signal('');

  buscarCliente(): void {
    if (!/^[0-9]{8}$/.test(this.dni)) {
      return;
    }
    this.clienteEncontrado.set(this.datos.buscarClientePorDni(this.dni) ?? null);
    this.busquedaHecha.set(true);
    this.error.set('');
  }

  // Si el DNI cambia, hay que volver a buscar al cliente.
  alCambiarDni(): void {
    this.busquedaHecha.set(false);
    this.clienteEncontrado.set(null);
  }

  guardar(formulario: NgForm): void {
    this.error.set('');
    if (!this.busquedaHecha()) {
      this.error.set('Busque al cliente por su DNI antes de guardar.');
      return;
    }
    if (formulario.invalid) {
      return;
    }

    const resultado = this.datos.registrarRecepcion(
      this.dni,
      this.clienteEncontrado() ? null : this.nuevoCliente,
      this.equipo,
      this.falla,
      this.accesorios,
      this.auth.usuario()!.nombre,
    );

    if (resultado.error) {
      this.error.set(resultado.error);
      return;
    }
    this.codigoCreado.set(resultado.orden!.codigo);
  }

  irAlPanel(): void {
    this.router.navigate(['/admin']);
  }

  // Limpia el formulario para registrar otro equipo sin salir de la pantalla.
  nuevaRecepcion(): void {
    this.dni = '';
    this.nuevoCliente = { nombres: '', correo: '', telefono: '' };
    this.equipo = { tipo: 'Laptop', marca: '', modelo: '', serie: '' };
    this.falla = '';
    this.accesorios = '';
    this.clienteEncontrado.set(null);
    this.busquedaHecha.set(false);
    this.error.set('');
    this.codigoCreado.set('');
  }
}