import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, forkJoin, map, of, switchMap, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Cliente,
  Equipo,
  EstadoOrden,
  MESES_GARANTIA,
  MovimientoOrden,
  Orden,
  Rol,
  Sede,
  TipoEquipo,
  Usuario,
} from '../models/modelos';
import { mensajeDeError } from '../utils/errores';

export interface AccesoCliente {
  usuario: string;
  clave: string;
}


@Injectable({ providedIn: 'root' })
export class DatosService {
  private http = inject(HttpClient);
  private api = environment.apiUrl;

  readonly sedes = signal<Sede[]>([]);
  readonly usuarios = signal<Usuario[]>([]);
  readonly clientes = signal<Cliente[]>([]);
  readonly tiposEquipo = signal<TipoEquipo[]>([]);
  readonly equipos = signal<Equipo[]>([]);
  readonly ordenes = signal<Orden[]>([]);

  readonly cargado = signal(false);
  readonly errorCarga = signal('');


  cargarInicial(rol: Rol): Observable<boolean> {
    if (this.cargado()) {
      return of(true);
    }
    const esPersonal = rol === 'ADMIN' || rol === 'RECEPCION';
    return forkJoin({
      sedes: this.http.get<Sede[]>(`${this.api}/sedes`),
      tipos: this.http.get<TipoEquipo[]>(`${this.api}/tipos-equipo`),
      ordenes: this.http.get<Orden[]>(`${this.api}/ordenes`),
      clientes: esPersonal ? this.http.get<Cliente[]>(`${this.api}/clientes`) : of([] as Cliente[]),
      personal:
        rol === 'ADMIN'
          ? this.http.get<Usuario[]>(`${this.api}/usuarios`)
          : rol === 'RECEPCION'
            ? this.http.get<Usuario[]>(`${this.api}/usuarios/tecnicos`)
            : of([] as Usuario[]),
    }).pipe(
      tap((datos) => {
        this.sedes.set(datos.sedes);
        this.tiposEquipo.set(datos.tipos);
        this.clientes.set(datos.clientes);
        this.usuarios.set(datos.personal);
        this.ordenes.set(datos.ordenes);
        this.equipos.set(this.equiposDe(datos.ordenes));
        this.errorCarga.set('');
        this.cargado.set(true);
      }),
      map(() => true),
      catchError((error) => {
        this.errorCarga.set(mensajeDeError(error));
        return of(error?.status !== 401);
      }),
    );
  }

  vaciar(): void {
    this.sedes.set([]);
    this.usuarios.set([]);
    this.clientes.set([]);
    this.tiposEquipo.set([]);
    this.equipos.set([]);
    this.ordenes.set([]);
    this.errorCarga.set('');
    this.cargado.set(false);
  }


  obtenerOrden(id: number): Orden | undefined {
    return this.ordenes().find((o) => o.id === id);
  }

  cliente(id: number): Cliente | undefined {
    return this.clientes().find((c) => c.id === id);
  }

  equipo(id: number): Equipo | undefined {
    return this.equipos().find((e) => e.id === id);
  }

  tecnicos(sedeId?: number): Usuario[] {
    return this.usuarios().filter(
      (u) => u.rol === 'TECNICO' && u.activo && (sedeId === undefined || u.sedeId === sedeId),
    );
  }

  sede(id?: number): Sede | undefined {
    return this.sedes().find((s) => s.id === id);
  }

  nombreSede(id?: number): string {
    return this.sede(id)?.nombre ?? 'Todas las sedes';
  }

  personal(): Usuario[] {
    return this.usuarios().filter((u) => u.rol !== 'CLIENTE');
  }

  cantidadPersonalDeSede(id: number): number {
    return this.personal().filter((u) => u.sedeId === id).length;
  }

  cantidadOrdenesDeSede(id: number): number {
    return this.ordenes().filter((o) => o.sedeId === id).length;
  }

  nombreTipo(id: number): string {
    return this.tiposEquipo().find((t) => t.id === id)?.nombre ?? '';
  }

  cantidadEquiposDeTipo(id: number): number {
    return this.equipos().filter((e) => e.tipoId === id).length;
  }

  cantidadOrdenesDeCliente(clienteId: number): number {
    return this.ordenes().filter((o) => o.clienteId === clienteId).length;
  }

  accesoDeCliente(clienteId: number): Usuario | undefined {
    return this.usuarios().find((u) => u.rol === 'CLIENTE' && u.clienteId === clienteId);
  }

  nombreTecnico(id?: number): string {
    return this.usuarios().find((u) => u.id === id)?.nombre ?? 'Sin asignar';
  }

  descripcionEquipo(id: number): string {
    const e = this.equipo(id);
    return e ? `${this.nombreTipo(e.tipoId)} ${e.modelo}` : '';
  }

  finGarantia(fechaCompra: string): Date {
    const fin = new Date(fechaCompra + 'T00:00:00');
    fin.setMonth(fin.getMonth() + MESES_GARANTIA);
    return fin;
  }

  garantiaVigente(fechaCompra: string, hoy: Date = new Date()): boolean {
    return hoy <= this.finGarantia(fechaCompra);
  }

 
  registrarRecepcion(datos: {
    dni: string;
    nombres?: string;
    correo?: string;
    telefono?: string;
    tipoId: number;
    modelo: string;
    serie: string;
    fechaCompra: string;
    falla: string;
    accesorios: string;
  }): Observable<{ orden: Orden; accesoCliente: AccesoCliente | null }> {
    return this.http
      .post<{ orden: Orden; accesoCliente: AccesoCliente | null }>(`${this.api}/ordenes/recepcion`, datos)
      .pipe(
        tap((respuesta) => this.guardarOrden(respuesta.orden)),
        switchMap((respuesta) =>
          respuesta.accesoCliente
            ? this.http.get<Cliente[]>(`${this.api}/clientes`).pipe(
                tap((lista) => this.clientes.set(lista)),
                map(() => respuesta),
              )
            : of(respuesta),
        ),
      );
  }


  buscarClientePorDni(dni: string): Observable<Cliente | null> {
    return this.http.get<Cliente>(`${this.api}/clientes/dni/${dni}`).pipe(
      catchError((error) => (error.status === 404 ? of(null) : throwError(() => error))),
    );
  }

  crearCliente(datos: {
    dni: string;
    nombres: string;
    correo: string;
    telefono: string;
  }): Observable<{ cliente: Cliente; acceso: AccesoCliente }> {
    return this.http
      .post<{ cliente: Cliente; acceso: AccesoCliente }>(`${this.api}/clientes`, datos)
      .pipe(tap((respuesta) => this.clientes.update((lista) => [...lista, respuesta.cliente])));
  }

  actualizarCliente(id: number, datos: { nombres: string; correo: string; telefono: string }): Observable<Cliente> {
    return this.http
      .put<Cliente>(`${this.api}/clientes/${id}`, datos)
      .pipe(tap((cliente) => this.clientes.update((lista) => lista.map((c) => (c.id === id ? cliente : c)))));
  }

  restablecerClaveCliente(clienteId: number): Observable<AccesoCliente> {
    return this.http.post<AccesoCliente>(`${this.api}/clientes/${clienteId}/restablecer-clave`, {});
  }


  agregarSede(datos: { nombre: string; ciudad: string; telefono: string }): Observable<Sede> {
    return this.http
      .post<Sede>(`${this.api}/sedes`, datos)
      .pipe(tap((sede) => this.sedes.update((lista) => [...lista, sede])));
  }

  actualizarSede(id: number, datos: { nombre: string; ciudad: string; telefono: string }): Observable<Sede> {
    return this.http
      .put<Sede>(`${this.api}/sedes/${id}`, datos)
      .pipe(tap((sede) => this.sedes.update((lista) => lista.map((s) => (s.id === id ? sede : s)))));
  }

  cambiarEstadoSede(id: number): Observable<Sede> {
    return this.http
      .patch<Sede>(`${this.api}/sedes/${id}/estado`, {})
      .pipe(tap((sede) => this.sedes.update((lista) => lista.map((s) => (s.id === id ? sede : s)))));
  }


  agregarTipoEquipo(nombre: string): Observable<TipoEquipo> {
    return this.http
      .post<TipoEquipo>(`${this.api}/tipos-equipo`, { nombre: nombre.trim() })
      .pipe(tap((tipo) => this.tiposEquipo.update((lista) => [...lista, tipo])));
  }

  eliminarTipoEquipo(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.api}/tipos-equipo/${id}`)
      .pipe(tap(() => this.tiposEquipo.update((lista) => lista.filter((t) => t.id !== id))));
  }


  registrarPersonal(datos: {
    rol: Rol;
    sedeId?: number | null;
    nombre: string;
    dni: string;
    telefono: string;
    correo: string;
    especialidad: string;
    usuario: string;
    clave: string;
  }): Observable<Usuario> {
    return this.http
      .post<Usuario>(`${this.api}/usuarios`, datos)
      .pipe(tap((usuario) => this.usuarios.update((lista) => [...lista, usuario])));
  }

  actualizarPersonal(
    id: number,
    datos: {
      sedeId?: number | null;
      nombre: string;
      dni: string;
      telefono: string;
      correo: string;
      especialidad: string;
      clave: string;
    },
  ): Observable<Usuario> {
    return this.http
      .put<Usuario>(`${this.api}/usuarios/${id}`, datos)
      .pipe(tap((usuario) => this.usuarios.update((lista) => lista.map((u) => (u.id === id ? usuario : u)))));
  }

  cambiarEstadoUsuario(id: number): Observable<Usuario> {
    return this.http
      .patch<Usuario>(`${this.api}/usuarios/${id}/estado`, {})
      .pipe(tap((usuario) => this.usuarios.update((lista) => lista.map((u) => (u.id === id ? usuario : u)))));
  }


  asignarTecnico(ordenId: number, tecnicoId: number, responsable: string): void {
    this.actualizar(ordenId, (o) => {
      o.tecnicoId = tecnicoId;
      o.estado = 'EN_DIAGNOSTICO';
      o.historial = [
        ...o.historial,
        this.movimiento('EN_DIAGNOSTICO', responsable, `Asignada a ${this.nombreTecnico(tecnicoId)}.`),
      ];
    });
  }

  enviarPresupuesto(ordenId: number, diagnostico: string, monto: number, responsable: string): void {
    this.actualizar(ordenId, (o) => {
      o.diagnostico = diagnostico;
      if (o.enGarantia) {
        o.montoPresupuesto = 0;
        o.decision = 'APROBADO';
        o.estado = 'EN_REPARACION';
        o.historial = [
          ...o.historial,
          this.movimiento('EN_REPARACION', responsable, 'Diagnóstico registrado. Cubierto por garantía: pasa directo a reparación.'),
        ];
        return;
      }
      o.montoPresupuesto = monto;
      o.estado = 'PRESUPUESTO_ENVIADO';
      o.historial = [
        ...o.historial,
        this.movimiento('PRESUPUESTO_ENVIADO', responsable, `Presupuesto de S/ ${monto.toFixed(2)} enviado al cliente.`),
      ];
    });
  }

  decidirPresupuesto(ordenId: number, aprobado: boolean, responsable: string): void {
    this.actualizar(ordenId, (o) => {
      o.decision = aprobado ? 'APROBADO' : 'RECHAZADO';
      o.estado = aprobado ? 'EN_REPARACION' : 'DEVUELTO_SIN_REPARAR';
      o.historial = [
        ...o.historial,
        this.movimiento(
          o.estado,
          responsable,
          aprobado ? 'El cliente aprobó el presupuesto.' : 'El cliente rechazó el presupuesto.',
        ),
      ];
    });
  }

  guardarReparacion(ordenId: number, actividad: string, repuestos: string, pruebas: string): void {
    this.actualizar(ordenId, (o) => {
      o.actividad = actividad;
      o.repuestos = repuestos;
      o.pruebas = pruebas;
    });
  }

  marcarListoParaEntrega(ordenId: number, responsable: string): void {
    this.actualizar(ordenId, (o) => {
      o.estado = 'LISTO_PARA_ENTREGA';
      o.historial = [
        ...o.historial,
        this.movimiento('LISTO_PARA_ENTREGA', responsable, 'Reparación y pruebas completadas.'),
      ];
    });
  }

  confirmarEntrega(
    ordenId: number,
    receptor: string,
    accesoriosDevueltos: string,
    observaciones: string,
    responsable: string,
  ): void {
    this.actualizar(ordenId, (o) => {
      o.receptor = receptor;
      o.accesoriosDevueltos = accesoriosDevueltos;
      o.observacionesEntrega = observaciones;
      o.estado = 'ENTREGADO';
      o.historial = [
        ...o.historial,
        this.movimiento('ENTREGADO', responsable, `Entregado a ${receptor}.`),
      ];
    });
  }


  private claveTemporalCliente(dni: string): string {
    return 'tf' + dni.slice(-4);
  }

  private siguienteIdUsuario(): number {
    return Math.max(0, ...this.usuarios().map((u) => u.id)) + 1;
  }

  private movimiento(estado: EstadoOrden, responsable: string, detalle: string): MovimientoOrden {
    return { fecha: new Date().toISOString(), estado, responsable, detalle };
  }

  private actualizar(id: number, cambio: (orden: Orden) => void): void {
    this.ordenes.update((lista) =>
      lista.map((o) => {
        if (o.id !== id) return o;
        const copia = { ...o };
        cambio(copia);
        return copia;
      }),
    );
  }

  private guardarOrden(orden: Orden): void {
    this.ordenes.update((lista) =>
      lista.some((o) => o.id === orden.id) ? lista.map((o) => (o.id === orden.id ? orden : o)) : [orden, ...lista],
    );
    this.equipos.set(this.equiposDe(this.ordenes()));
  }

  private equiposDe(ordenes: Orden[]): Equipo[] {
    const porId = new Map<number, Equipo>();
    for (const orden of ordenes) {
      if (orden.equipo) {
        porId.set(orden.equipo.id, orden.equipo);
      }
    }
    return [...porId.values()];
  }
}