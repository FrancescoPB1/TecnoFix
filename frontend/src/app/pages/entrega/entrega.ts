import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatosService } from '../../services/datos.service';
import { AuthService } from '../../services/auth.service';
import { EstadoBadge } from '../../shared/estado-badge/estado-badge';
import { ConfirmarDialogo } from '../../shared/confirmar-dialogo/confirmar-dialogo';
import { MensajeFeedback } from '../../shared/mensaje-feedback/mensaje-feedback';
import { mensajeDeError } from '../../utils/errores';

@Component({
  selector: 'app-entrega',
  imports: [FormsModule, RouterLink, EstadoBadge, ConfirmarDialogo, MensajeFeedback],
  templateUrl: './entrega.html',
})
export class Entrega {
  readonly datos = inject(DatosService);
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);

  private id = Number(this.route.snapshot.paramMap.get('id'));
  readonly orden = computed(() => this.datos.obtenerOrden(this.id));

  receptor = '';
  accesoriosDevueltos = this.orden()?.accesorios ?? '';
  observaciones = '';

  readonly confirmando = signal(false);
  readonly entregado = signal(false);
  readonly error = signal('');

  readonly deOtraSede = computed(() => this.orden()?.sedeId !== this.auth.usuario()?.sedeId);

  readonly puedeEntregarse = computed(() => {
    const orden = this.orden();
    const estado = orden?.estado;
    if (this.deOtraSede()) {
      return false;
    }
    return estado === 'LISTO_PARA_ENTREGA' || estado === 'DEVUELTO_SIN_REPARAR';
  });

  pedirConfirmacion(formulario: NgForm): void {
    if (formulario.invalid) {
      return;
    }
    this.confirmando.set(true);
  }

  confirmar(): void {
    this.confirmando.set(false);
    this.error.set('');
    this.datos.confirmarEntrega(this.id, this.receptor, this.accesoriosDevueltos, this.observaciones).subscribe({
      next: () => this.entregado.set(true),
      error: (e) => this.error.set(mensajeDeError(e)),
    });
  }
}