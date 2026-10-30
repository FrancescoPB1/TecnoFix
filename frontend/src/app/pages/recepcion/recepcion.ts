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
  readonly datos = inject(DatosService);
  private auth = inject(AuthService);
  private router = inject(Router);

  dni = '';
  nuevoCliente = { nombres: '', correo: '', telefono: '' };
  equipo: { tipoId: number | null; marcaId: number | null; modelo: string; serie: string } = {
    tipoId: null,
    marcaId: null,
    modelo: '',
    serie: '',
  };
  falla = '';
  accesorios = '';

  readonly clienteEncontrado = signal<Cliente | null>(null);
  readonly busquedaHecha = signal(false);
  readonly error = signal('');
  readonly codigoCreado = signal('');
  // Acceso que se crea cuando el cliente es nuevo (recepción se lo entrega en el mostrador).
  readonly accesoCliente = signal<{ usuario: string; clave: string } | null>(null);

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
      { tipoId: this.equipo.tipoId!, marcaId: this.equipo.marcaId!, modelo: this.equipo.modelo, serie: this.equipo.serie },
      this.falla,
      this.accesorios,
      this.auth.usuario()!.nombre,
    );

    if (resultado.error) {
      this.error.set(resultado.error);
      return;
    }
    this.codigoCreado.set(resultado.orden!.codigo);
    this.accesoCliente.set(resultado.accesoCliente ?? null);
  }

  irAlPanel(): void {
    this.router.navigate(['/admin']);
  }

  // Limpia el formulario para registrar otro equipo sin salir de la pantalla.
  nuevaRecepcion(): void {
    this.dni = '';
    this.nuevoCliente = { nombres: '', correo: '', telefono: '' };
    this.equipo = { tipoId: null, marcaId: null, modelo: '', serie: '' };
    this.falla = '';
    this.accesorios = '';
    this.clienteEncontrado.set(null);
    this.busquedaHecha.set(false);
    this.error.set('');
    this.codigoCreado.set('');
    this.accesoCliente.set(null);
  }
}