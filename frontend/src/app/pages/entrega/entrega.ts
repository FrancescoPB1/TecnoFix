import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatosService } from '../../services/datos.service';
import { AuthService } from '../../services/auth.service';
import { EstadoBadge } from '../../shared/estado-badge/estado-badge';
import { ConfirmarDialogo } from '../../shared/confirmar-dialogo/confirmar-dialogo';
import { ListaAvances } from '../../shared/lista-avances/lista-avances';
import { MensajeFeedback } from '../../shared/mensaje-feedback/mensaje-feedback';
import { mensajeDeError } from '../../utils/errores';

@Component({
  selector: 'app-entrega',
  imports: [FormsModule, RouterLink, EstadoBadge, ConfirmarDialogo, ListaAvances, MensajeFeedback],
  templateUrl: './entrega.html',
})
export class Entrega {
  readonly datos = inject(DatosService);
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);

  private id = Number(this.route.snapshot.paramMap.get('id'));
  readonly orden = computed(() => this.datos.obtenerOrden(this.id));

  titular = true;
  receptor = '';
  observaciones = '';

  readonly devueltos = signal<number[]>([]);

  readonly confirmando = signal(false);
  readonly entregado = signal(false);
  readonly error = signal('');

  readonly deOtraSede = computed(() => this.orden()?.sedeId !== this.auth.usuario()?.sedeId);

  readonly nombreCliente = computed(() => {
    const orden = this.orden();
    return orden?.clienteNombre ?? this.datos.cliente(orden?.clienteId ?? 0)?.nombres ?? '';
  });

  readonly sinDevolver = computed(() => (this.orden()?.accesorios ?? []).filter((a) => !this.devueltos().includes(a.id)));

  readonly puedeEntregarse = computed(() => {
    const estado = this.orden()?.estado;
    if (this.deOtraSede()) {
      return false;
    }
    return estado === 'LISTO_PARA_ENTREGA' || estado === 'DEVUELTO_SIN_REPARAR';
  });

  estaDevuelto(accesorioId: number): boolean {
    return this.devueltos().includes(accesorioId);
  }

  alternarDevuelto(accesorioId: number, marcado: boolean): void {
    this.devueltos.update((lista) =>
      marcado ? [...lista.filter((id) => id !== accesorioId), accesorioId] : lista.filter((id) => id !== accesorioId),
    );
  }

  marcarTodos(): void {
    this.devueltos.set((this.orden()?.accesorios ?? []).map((a) => a.id));
  }

  pedirConfirmacion(formulario: NgForm): void {
    if (formulario.invalid) {
      return;
    }
    this.confirmando.set(true);
  }

  confirmar(): void {
    this.confirmando.set(false);
    this.error.set('');
    const receptor = this.titular ? '' : this.receptor.trim();
    this.datos.confirmarEntrega(this.id, receptor, this.titular, this.devueltos(), this.observaciones.trim()).subscribe({
      next: () => this.entregado.set(true),
      error: (e) => this.error.set(mensajeDeError(e)),
    });
  }
}