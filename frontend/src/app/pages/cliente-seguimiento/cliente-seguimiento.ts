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
  readonly pasos = PASOS;

  readonly orden = computed(() => {
    const o = this.datos.obtenerOrden(this.id);
    // Un cliente solo puede ver sus propias órdenes.
    return o && o.clienteId === this.auth.usuario()?.clienteId ? o : undefined;
  });

  readonly pasoActual = computed(() => {
    const o = this.orden();
    return o ? PASO_ACTUAL[o.estado] : 0;
  });

  // Decisión que espera confirmación: true = aprobar, false = rechazar, null = ninguna.
  readonly pendiente = signal<boolean | null>(null);
  readonly mensaje = signal('');

  confirmarDecision(): void {
    const aprobado = this.pendiente();
    if (aprobado === null) {
      return;
    }
    this.datos.decidirPresupuesto(this.id, aprobado, this.auth.usuario()!.nombre);
    this.pendiente.set(null);
    this.mensaje.set(
      aprobado
        ? 'Aprobó el presupuesto. El técnico iniciará la reparación.'
        : 'Rechazó el presupuesto. El equipo se preparará para su devolución sin reparar.',
    );
  }
}