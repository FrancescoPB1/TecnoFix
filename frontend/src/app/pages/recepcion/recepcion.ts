import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DatosService } from '../../services/datos.service';
import { AuthService } from '../../services/auth.service';
import { Cliente } from '../../models/modelos';
import { MensajeFeedback } from '../../shared/mensaje-feedback/mensaje-feedback';
import { mensajeDeError } from '../../utils/errores';

@Component({
  selector: 'app-recepcion',
  imports: [FormsModule, RouterLink, MensajeFeedback],
  templateUrl: './recepcion.html',
})
export class Recepcion {
  readonly datos = inject(DatosService);
  private auth = inject(AuthService);
  private router = inject(Router);
  readonly miSedeId = this.auth.usuario()?.sedeId;

  dni = '';
  nuevoCliente = { nombres: '', correo: '', telefono: '' };
  equipo: { tipoId: number | null; modelo: string; serie: string; fechaCompra: string } = {
    tipoId: null,
    modelo: '',
    serie: '',
    fechaCompra: '',
  };
  readonly hoy = new Date().toISOString().slice(0, 10);
  falla = '';
  accesorios = '';

  readonly clienteEncontrado = signal<Cliente | null>(null);
  readonly busquedaHecha = signal(false);
  readonly error = signal('');
  readonly codigoCreado = signal('');
  readonly accesoCliente = signal<{ usuario: string; clave: string } | null>(null);

  buscarCliente(): void {
    if (!/^[0-9]{8}$/.test(this.dni)) {
      return;
    }
    this.error.set('');
    this.datos.buscarClientePorDni(this.dni).subscribe({
      next: (cliente) => {
        this.clienteEncontrado.set(cliente);
        this.busquedaHecha.set(true);
      },
      error: (e) => this.error.set(mensajeDeError(e)),
    });
  }

  garantia(): { vigente: boolean; texto: string } | null {
    if (!this.equipo.fechaCompra) {
      return null;
    }
    const vigente = this.datos.garantiaVigente(this.equipo.fechaCompra);
    const fin = this.datos.finGarantia(this.equipo.fechaCompra).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    return {
      vigente,
      texto: vigente ? `En garantía hasta el ${fin}. La reparación no tendrá costo.` : `Garantía vencida el ${fin}. Se cobrará según presupuesto.`,
    };
  }

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

    const datosCliente = this.clienteEncontrado() ? {} : this.nuevoCliente;

    this.datos
      .registrarRecepcion({
        dni: this.dni,
        ...datosCliente,
        tipoId: this.equipo.tipoId!,
        modelo: this.equipo.modelo,
        serie: this.equipo.serie,
        fechaCompra: this.equipo.fechaCompra,
        falla: this.falla,
        accesorios: this.accesorios,
      })
      .subscribe({
        next: (resultado) => {
          this.codigoCreado.set(resultado.orden.codigo);
          this.accesoCliente.set(resultado.accesoCliente);
        },
        error: (e) => this.error.set(mensajeDeError(e)),
      });
  }

  irAlPanel(): void {
    this.router.navigate(['/admin']);
  }

  nuevaRecepcion(): void {
    this.dni = '';
    this.nuevoCliente = { nombres: '', correo: '', telefono: '' };
    this.equipo = { tipoId: null, modelo: '', serie: '', fechaCompra: '' };
    this.falla = '';
    this.accesorios = '';
    this.clienteEncontrado.set(null);
    this.busquedaHecha.set(false);
    this.error.set('');
    this.codigoCreado.set('');
    this.accesoCliente.set(null);
  }
}