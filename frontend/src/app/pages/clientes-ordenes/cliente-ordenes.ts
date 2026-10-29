import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatosService } from '../../services/datos.service';
import { AuthService } from '../../services/auth.service';
import { EstadoBadge } from '../../shared/estado-badge/estado-badge';

@Component({
  selector: 'app-cliente-ordenes',
  imports: [RouterLink, EstadoBadge],
  templateUrl: './cliente-ordenes.html',
})
export class ClienteOrdenes {
  readonly datos = inject(DatosService);
  private auth = inject(AuthService);

  // El cliente solo ve sus propias órdenes.
  readonly ordenes = computed(() =>
    this.datos.ordenes().filter((o) => o.clienteId === this.auth.usuario()?.clienteId),
  );
}