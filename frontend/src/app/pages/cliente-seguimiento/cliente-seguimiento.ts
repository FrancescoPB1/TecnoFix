import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatosService } from '../../services/datos.service';
import { AuthService } from '../../services/auth.service';
import { EstadoOrden } from '../../models/modelos';
import { EstadoBadge } from '../../shared/estado-badge/estado-badge';
import { MensajeFeedback } from '../../shared/mensaje-feedback/mensaje-feedback';
import { ConfirmarDialogo } from '../../shared/confirmar-dialogo/confirmar-dialogo';
import { DecisionPresupuesto } from '../decision-presupuesto/decision-presupuesto';
import { mensajeDeError } from '../../utils/errores';

const PASOS = ['Recepción', 'Diagnóstico', 'Autorización', 'Reparación', 'Listo', 'Entregado'];

const PASO_ACTUAL: Record<EstadoOrden, number> = {
  RECIBIDO: 0,
  EN_DIAGNOSTICO: 1,
  PRESUPUESTO_ENVIADO: 2,
  DEVUELTO_SIN_REPARAR: 2,
  EN_REPARACION: 3,
  LISTO_PARA_ENTREGA: 4,
  ENTREGADO: 5,
};

@Component({
  selector: 'app-cliente-seguimiento',
  imports: [DatePipe, RouterLink, EstadoBadge, MensajeFeedback, ConfirmarDialogo, DecisionPresupuesto],
  templateUrl: './cliente-seguimiento.html',
})
export class ClienteSeguimiento {
  readonly datos = inject(DatosService);
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);

  private id = Number(this.route.snapshot.paramMap.get('id'));
  readonly pasos = computed(() => PASOS.map((p) => (p === 'Autorización' && this.orden()?.enGarantia ? 'Garantía' : p)));

  readonly orden = computed(() => {
    const o = this.datos.obtenerOrden(this.id);
    return o && o.clienteId === this.auth.usuario()?.clienteId ? o : undefined;
  });

  readonly pasoActual = computed(() => {
    const o = this.orden();
    return o ? PASO_ACTUAL[o.estado] : 0;
  });

  readonly pendiente = signal<boolean | null>(null);
  readonly mensaje = signal('');
  readonly error = signal('');

  confirmarDecision(): void {
    const aprobado = this.pendiente();
    if (aprobado === null) {
      return;
    }
    this.pendiente.set(null);
    this.mensaje.set('');
    this.error.set('');
    this.datos.decidirPresupuesto(this.id, aprobado).subscribe({
      next: () =>
        this.mensaje.set(
          aprobado
            ? 'Aprobó el presupuesto. El técnico iniciará la reparación.'
            : 'Rechazó el presupuesto. El equipo se preparará para su devolución sin reparar.',
        ),
      error: (e) => this.error.set(mensajeDeError(e)),
    });
  }
}