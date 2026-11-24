import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatosService } from '../../services/datos.service';
import { AuthService } from '../../services/auth.service';
import { ETIQUETA_ESTADO, EstadoOrden, Orden } from '../../models/modelos';
import { EstadoBadge } from '../../shared/estado-badge/estado-badge';
import { MensajeFeedback } from '../../shared/mensaje-feedback/mensaje-feedback';
import { mensajeDeError } from '../../utils/errores';
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

  readonly esRecepcion = this.auth.usuario()?.rol === 'RECEPCION';

  readonly estados = Object.entries(ETIQUETA_ESTADO) as [EstadoOrden, string][];

  readonly texto = signal('');
  readonly mensaje = signal('');
  readonly error = signal('');
  readonly seleccion = signal<Record<number, number>>({});

  private params = toSignal(this.route.queryParamMap, { initialValue: this.route.snapshot.queryParamMap });
  readonly estadoFiltro = computed(() => this.params().get('estado') ?? '');

  readonly miSedeId = this.auth.usuario()?.sedeId;
  readonly sedeFiltro = computed(() => (this.esRecepcion ? (this.miSedeId ?? 0) : Number(this.params().get('sede') ?? 0)));

  private readonly ordenesDeLaSede = computed(() => {
    const sede = this.sedeFiltro();
    return this.datos.ordenes().filter((o) => !sede || o.sedeId === sede);
  });

  readonly ordenesFiltradas = computed(() => {
    const estado = this.estadoFiltro();
    const busqueda = this.texto().trim().toLowerCase();
    return this.ordenesDeLaSede().filter((o) => {
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
    const lista = this.ordenesDeLaSede();
    const contar = (e: EstadoOrden) => lista.filter((o) => o.estado === e).length;
    return [
      { estado: 'RECIBIDO' as EstadoOrden, titulo: 'Sin asignar', cantidad: contar('RECIBIDO'), icono: 'bi-inbox', color: 'stat-gris' },
      { estado: 'EN_DIAGNOSTICO' as EstadoOrden, titulo: 'En diagnóstico', cantidad: contar('EN_DIAGNOSTICO'), icono: 'bi-search', color: 'stat-celeste' },
      { estado: 'EN_REPARACION' as EstadoOrden, titulo: 'En reparación', cantidad: contar('EN_REPARACION'), icono: 'bi-wrench-adjustable', color: 'stat-azul' },
      { estado: 'LISTO_PARA_ENTREGA' as EstadoOrden, titulo: 'Listas para entrega', cantidad: contar('LISTO_PARA_ENTREGA'), icono: 'bi-check2-circle', color: 'stat-verde' },
    ];
  });

  readonly resumenPorSede = computed(() =>
    this.datos.sedes().map((s) => {
      const lista = this.datos.ordenes().filter((o) => o.sedeId === s.id);
      return {
        sede: s,
        total: lista.length,
        sinAsignar: lista.filter((o) => o.estado === 'RECIBIDO').length,
        enProceso: lista.filter((o) => ['EN_DIAGNOSTICO', 'PRESUPUESTO_ENVIADO', 'EN_REPARACION'].includes(o.estado)).length,
        listas: lista.filter((o) => o.estado === 'LISTO_PARA_ENTREGA').length,
        entregadas: lista.filter((o) => o.estado === 'ENTREGADO').length,
      };
    }),
  );

  cambiarFiltro(estado: string): void {
    this.router.navigate([], { queryParams: { estado: estado || null }, queryParamsHandling: 'merge' });
  }

  cambiarSede(sede: string): void {
    this.router.navigate([], { queryParams: { sede: sede || null }, queryParamsHandling: 'merge' });
  }

  elegirTecnico(ordenId: number, valor: string): void {
    this.seleccion.update((s) => ({ ...s, [ordenId]: Number(valor) }));
  }

  asignar(orden: Orden): void {
    this.mensaje.set('');
    this.error.set('');
    const tecnicoId = this.seleccion()[orden.id];
    if (!tecnicoId) {
      this.error.set('Elija un técnico antes de asignar la orden ' + orden.codigo + '.');
      return;
    }
    this.datos.asignarTecnico(orden.id, tecnicoId).subscribe({
      next: (actualizada) => this.mensaje.set(`Orden ${actualizada.codigo} asignada a ${actualizada.tecnicoNombre}.`),
      error: (e) => this.error.set(mensajeDeError(e)),
    });
  }

  puedeEntregarse(orden: Orden): boolean {
    return orden.estado === 'LISTO_PARA_ENTREGA' || orden.estado === 'DEVUELTO_SIN_REPARAR';
  }
}