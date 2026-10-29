import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatosService } from '../../services/datos.service';
import { AuthService } from '../../services/auth.service';
import { EstadoBadge } from '../../shared/estado-badge/estado-badge';

@Component({
  selector: 'app-tecnico-ordenes',
  imports: [RouterLink, EstadoBadge],
  templateUrl: './tecnico-ordenes.html',
})
export class TecnicoOrdenes {
  readonly datos = inject(DatosService);
  private auth = inject(AuthService);

  // Solo se listan las órdenes asignadas al técnico que inició sesión.
  readonly ordenes = computed(() =>
    this.datos.ordenes().filter((o) => o.tecnicoId === this.auth.usuario()?.id),
  );
}