import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatosService } from '../../services/datos.service';
import { AuthService } from '../../services/auth.service';
import { EstadoBadge } from '../../shared/estado-badge/estado-badge';

@Component({
  selector: 'app-tecnico-diagnostico',
  imports: [FormsModule, RouterLink, EstadoBadge],
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

  // El técnico solo puede diagnosticar órdenes que tiene asignadas y en estado de diagnóstico.
  readonly permitido = computed(() => {
    const o = this.orden();
    return !!o && o.tecnicoId === this.auth.usuario()?.id && o.estado === 'EN_DIAGNOSTICO';
  });

  enviar(formulario: NgForm): void {
    if (formulario.invalid || this.monto === null) {
      return;
    }
    this.datos.enviarPresupuesto(this.id, this.diagnostico, this.monto, this.auth.usuario()!.nombre);
    this.enviado.set(true);
  }
}