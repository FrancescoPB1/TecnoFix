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
    this.clienteEncontrado.set(this.datos.buscarClientePorDni(this.dni) ?? null);
    this.busquedaHecha.set(true);
    this.error.set('');
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

    const resultado = this.datos.registrarRecepcion(
      this.dni,
      this.clienteEncontrado() ? null : this.nuevoCliente,
      {
        tipoId: this.equipo.tipoId!,
        modelo: this.equipo.modelo,
        serie: this.equipo.serie,
        fechaCompra: this.equipo.fechaCompra,
      },
      this.falla,
      this.accesorios,
      this.auth.usuario()!.nombre,
      this.auth.usuario()!.sedeId!,
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