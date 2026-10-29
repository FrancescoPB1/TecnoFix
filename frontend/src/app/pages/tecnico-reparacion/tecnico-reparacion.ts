import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatosService } from '../../services/datos.service';
import { AuthService } from '../../services/auth.service';
import { EstadoBadge } from '../../shared/estado-badge/estado-badge';
import { MensajeFeedback } from '../../shared/mensaje-feedback/mensaje-feedback';

@Component({
  selector: 'app-tecnico-reparacion',
  imports: [FormsModule, RouterLink, EstadoBadge, MensajeFeedback],
  templateUrl: './tecnico-reparacion.html',
})
export class TecnicoReparacion {
  readonly datos = inject(DatosService);
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);

  private id = Number(this.route.snapshot.paramMap.get('id'));
  readonly orden = computed(() => this.datos.obtenerOrden(this.id));

  actividad = this.orden()?.actividad ?? '';
  repuestos = this.orden()?.repuestos ?? '';
  pruebas = this.orden()?.pruebas ?? '';

  readonly mensaje = signal('');
  readonly terminado = signal(false);

  readonly permitido = computed(() => {
    const o = this.orden();
    return !!o && o.tecnicoId === this.auth.usuario()?.id && (o.estado === 'EN_REPARACION' || this.terminado());
  });

  guardar(): void {
    this.datos.guardarReparacion(this.id, this.actividad, this.repuestos, this.pruebas);
    this.mensaje.set('Avance guardado.');
  }

  marcarListo(formulario: NgForm): void {
    // Para dejar la orden lista, la actividad y las pruebas son obligatorias.
    if (formulario.invalid) {
      return;
    }
    this.datos.guardarReparacion(this.id, this.actividad, this.repuestos, this.pruebas);
    this.datos.marcarListoParaEntrega(this.id, this.auth.usuario()!.nombre);
    this.terminado.set(true);
  }
}