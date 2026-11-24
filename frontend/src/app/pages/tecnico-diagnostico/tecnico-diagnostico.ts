import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatosService } from '../../services/datos.service';
import { AuthService } from '../../services/auth.service';
import { EstadoBadge } from '../../shared/estado-badge/estado-badge';
import { MensajeFeedback } from '../../shared/mensaje-feedback/mensaje-feedback';
import { mensajeDeError } from '../../utils/errores';

@Component({
  selector: 'app-tecnico-diagnostico',
  imports: [FormsModule, RouterLink, EstadoBadge, MensajeFeedback],
  templateUrl: './tecnico-diagnostico.html',
})
export class TecnicoDiagnostico {
  readonly datos = inject(DatosService);
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);

  private id = Number(this.route.snapshot.paramMap.get('id'));
  readonly orden = computed(() => this.datos.obtenerOrden(this.id));

  diagnostico = '';
  monto: number | null = null;
  readonly enviado = signal(false);
  readonly error = signal('');

  readonly permitido = computed(() => {
    const o = this.orden();
    return !!o && o.tecnicoId === this.auth.usuario()?.id && o.estado === 'EN_DIAGNOSTICO';
  });

  enviar(formulario: NgForm): void {
    const enGarantia = this.orden()!.enGarantia;
    if (formulario.invalid || (!enGarantia && this.monto === null)) {
      return;
    }
    this.error.set('');
    this.datos.enviarPresupuesto(this.id, this.diagnostico, enGarantia ? 0 : this.monto!).subscribe({
      next: () => this.enviado.set(true),
      error: (e) => this.error.set(mensajeDeError(e)),
    });
  }
}