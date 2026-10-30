import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatosService } from '../../services/datos.service';
import { AuthService } from '../../services/auth.service';
import { ETIQUETA_ESTADO, EstadoOrden, Orden } from '../../models/modelos';
import { EstadoBadge } from '../../shared/estado-badge/estado-badge';
import { MensajeFeedback } from '../../shared/mensaje-feedback/mensaje-feedback';

@Component({
  selector: 'app-panel-admin',
  imports: [FormsModule, RouterLink, EstadoBadge, MensajeFeedback],
  templateUrl: './panel-admin.html',
})
export class PanelAdmin {
  readonly datos = inject(DatosService);
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // Solo recepción registra equipos y entregas; el administrador supervisa el panel.
  readonly esRecepcion = this.auth.usuario()?.rol === 'RECEPCION';

  readonly estados = Object.entries(ETIQUETA_ESTADO) as [EstadoOrden, string][];

  readonly texto = signal('');
  readonly mensaje = signal('');
  // Técnico elegido en cada fila antes de asignar (clave: id de la orden).
  readonly seleccion = signal<Record<number, number>>({});

  // El filtro por estado viaja en la URL: /admin?estado=RECIBIDO
  private params = toSignal(this.route.queryParamMap, { initialValue: this.route.snapshot.queryParamMap });
  readonly estadoFiltro = computed(() => this.params().get('estado') ?? '');

  readonly ordenesFiltradas = computed(() => {
    const estado = this.estadoFiltro();
    const busqueda = this.texto().trim().toLowerCase();
    return this.datos.ordenes().filter((o) => {
      if (estado && o.estado !== estado) {
        return false;
      }
      if (!busqueda) {
        return true;
      }
      const cliente = this.datos.cliente(o.clienteId)?.nombres ?? '';
      const equipo = this.datos.descripcionEquipo(o.equipoId);
      return `${o.codigo} ${cliente} ${equipo}`.toLowerCase().includes(busqueda);
    });
  });

  readonly resumen = computed(() => {
    const lista = this.datos.ordenes();
    const contar = (e: EstadoOrden) => lista.filter((o) => o.estado === e).length;
    return [
      { estado: 'RECIBIDO' as EstadoOrden, titulo: 'Sin asignar', cantidad: contar('RECIBIDO'), icono: 'bi-inbox', color: 'stat-gris' },
      { estado: 'EN_DIAGNOSTICO' as EstadoOrden, titulo: 'En diagnóstico', cantidad: contar('EN_DIAGNOSTICO'), icono: 'bi-search', color: 'stat-celeste' },
      { estado: 'EN_REPARACION' as EstadoOrden, titulo: 'En reparación', cantidad: contar('EN_REPARACION'), icono: 'bi-wrench-adjustable', color: 'stat-azul' },
      { estado: 'LISTO_PARA_ENTREGA' as EstadoOrden, titulo: 'Listas para entrega', cantidad: contar('LISTO_PARA_ENTREGA'), icono: 'bi-check2-circle', color: 'stat-verde' },
    ];
  });

  cambiarFiltro(estado: string): void {
    this.router.navigate([], { queryParams: { estado: estado || null }, queryParamsHandling: 'merge' });
  }

  elegirTecnico(ordenId: number, valor: string): void {
    this.seleccion.update((s) => ({ ...s, [ordenId]: Number(valor) }));
  }

  asignar(orden: Orden): void {
    const tecnicoId = this.seleccion()[orden.id];
    if (!tecnicoId) {
      this.mensaje.set('Elija un técnico antes de asignar la orden ' + orden.codigo + '.');
      return;
    }
    this.datos.asignarTecnico(orden.id, tecnicoId, this.auth.usuario()!.nombre);
    this.mensaje.set(`Orden ${orden.codigo} asignada a ${this.datos.nombreTecnico(tecnicoId)}.`);
  }

  puedeEntregarse(orden: Orden): boolean {
    return orden.estado === 'LISTO_PARA_ENTREGA' || orden.estado === 'DEVUELTO_SIN_REPARAR';
  }
}