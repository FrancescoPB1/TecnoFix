import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatosService } from '../../services/datos.service';
import { AuthService } from '../../services/auth.service';
import { EstadoBadge } from '../../shared/estado-badge/estado-badge';
import { ListaAvances } from '../../shared/lista-avances/lista-avances';
import { MensajeFeedback } from '../../shared/mensaje-feedback/mensaje-feedback';
import { mensajeDeError } from '../../utils/errores';

@Component({
  selector: 'app-tecnico-reparacion',
  imports: [FormsModule, RouterLink, EstadoBadge, ListaAvances, MensajeFeedback],
  templateUrl: './tecnico-reparacion.html',
})
export class TecnicoReparacion {
  readonly datos = inject(DatosService);
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);

  private id = Number(this.route.snapshot.paramMap.get('id'));
  readonly orden = computed(() => this.datos.obtenerOrden(this.id));

  actividad = '';
  repuestos = '';
  pruebas = '';

  readonly mensaje = signal('');
  readonly error = signal('');
  readonly terminado = signal(false);
  readonly faltaActividad = signal(false);
  readonly faltaPruebas = signal(false);

  readonly permitido = computed(() => {
    const o = this.orden();
    return !!o && o.tecnicoId === this.auth.usuario()?.id && (o.estado === 'EN_REPARACION' || this.terminado());
  });

  private limpiarCampos(): void {
    this.actividad = '';
    this.repuestos = '';
    this.pruebas = '';
    this.faltaActividad.set(false);
    this.faltaPruebas.set(false);
  }

  guardar(): void {
    this.mensaje.set('');
    this.error.set('');
    this.faltaPruebas.set(false);
    if (!this.actividad.trim()) {
      this.faltaActividad.set(true);
      return;
    }
    this.datos.guardarReparacion(this.id, this.actividad.trim(), this.repuestos.trim(), this.pruebas.trim(), false).subscribe({
      next: () => {
        this.limpiarCampos();
        this.mensaje.set('Avance guardado. Quedó en el historial de la orden.');
      },
      error: (e) => this.error.set(mensajeDeError(e)),
    });
  }

  marcarListo(): void {
    this.mensaje.set('');
    this.error.set('');
    this.faltaActividad.set(!this.actividad.trim());
    this.faltaPruebas.set(!this.pruebas.trim());
    if (!this.actividad.trim() || !this.pruebas.trim()) {
      return;
    }
    this.datos.guardarReparacion(this.id, this.actividad.trim(), this.repuestos.trim(), this.pruebas.trim(), true).subscribe({
      next: () => {
        this.limpiarCampos();
        this.terminado.set(true);
      },
      error: (e) => this.error.set(mensajeDeError(e)),
    });
  }
}