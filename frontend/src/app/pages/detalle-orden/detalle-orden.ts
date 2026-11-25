import { Component, computed, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatosService } from '../../services/datos.service';
import { EstadoBadge } from '../../shared/estado-badge/estado-badge';
import { ListaAvances } from '../../shared/lista-avances/lista-avances';


@Component({
  selector: 'app-detalle-orden',
  imports: [DatePipe, RouterLink, EstadoBadge, ListaAvances],
  templateUrl: './detalle-orden.html',
})
export class DetalleOrden {
  readonly datos = inject(DatosService);
  private route = inject(ActivatedRoute);

  private id = Number(this.route.snapshot.paramMap.get('id'));
  readonly orden = computed(() => this.datos.obtenerOrden(this.id));

  readonly cliente = computed(() => this.datos.cliente(this.orden()?.clienteId ?? 0));

  readonly cerrada = computed(() => {
    const estado = this.orden()?.estado;
    return estado === 'ENTREGADO';
  });
}