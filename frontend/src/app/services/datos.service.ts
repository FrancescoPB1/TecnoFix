import { Injectable, signal } from '@angular/core';
import {
  Cliente,
  Equipo,
  EstadoOrden,
  MovimientoOrden,
  Orden,
  Usuario,
} from '../models/modelos';

/**
 * Data Service del prototipo.
 * Guarda los datos de ejemplo en memoria con signals. En el Capítulo 6 estas
 * operaciones se reemplazarán por peticiones HttpClient a la API REST.
 */
@Injectable({ providedIn: 'root' })
export class DatosService {
  readonly usuarios = signal<Usuario[]>([
    { id: 1, nombre: 'Marcela Torres', usuario: 'recepcion', clave: 'demo123', rol: 'ADMIN' },
    { id: 2, nombre: 'Julio Quispe', usuario: 'tecnico1', clave: 'demo123', rol: 'TECNICO' },
    { id: 3, nombre: 'Carla Vera', usuario: 'tecnico2', clave: 'demo123', rol: 'TECNICO' },
    { id: 4, nombre: 'Rolando Díaz', usuario: 'tecnico3', clave: 'demo123', rol: 'TECNICO' },
    { id: 5, nombre: 'Luis Paredes Rojas', usuario: 'cliente1', clave: 'demo123', rol: 'CLIENTE', clienteId: 1 },
    { id: 6, nombre: 'Ana Rojas Vega', usuario: 'cliente2', clave: 'demo123', rol: 'CLIENTE', clienteId: 2 },
  ]);

  readonly clientes = signal<Cliente[]>([
    { id: 1, dni: '45871236', nombres: 'Luis Paredes Rojas', correo: 'luis.paredes@correo.com', telefono: '987654321' },
    { id: 2, dni: '72418596', nombres: 'Ana Rojas Vega', correo: 'ana.rojas@correo.com', telefono: '945123678' },
    { id: 3, dni: '41256387', nombres: 'Pedro Salinas Cruz', correo: 'pedro.salinas@correo.com', telefono: '912345987' },
  ]);

  readonly equipos = signal<Equipo[]>([
    { id: 1, clienteId: 1, tipo: 'Laptop', marca: 'HP', modelo: 'Pavilion 15', serie: '5CD1234ABC' },
    { id: 2, clienteId: 2, tipo: 'PC de escritorio', marca: 'Lenovo', modelo: 'ThinkCentre M70', serie: 'PC-77412' },
    { id: 3, clienteId: 1, tipo: 'Laptop', marca: 'Dell', modelo: 'Inspiron 3501', serie: 'DL-8842' },
    { id: 4, clienteId: 3, tipo: 'Impresora', marca: 'Epson', modelo: 'L3150', serie: 'EP-30551' },
    { id: 5, clienteId: 2, tipo: 'Laptop', marca: 'Lenovo', modelo: 'IdeaPad 3', serie: 'LN-90217' },
  ]);

  readonly ordenes = signal<Orden[]>([
    {
      id: 1, codigo: 'ST-0001', clienteId: 1, equipoId: 1, tecnicoId: 2,
      falla: 'No enciende; a veces parpadea el LED de carga.',
      accesorios: 'Cargador original',
      estado: 'EN_DIAGNOSTICO',
      historial: [
        { fecha: '2026-10-26T09:10:00', estado: 'RECIBIDO', responsable: 'Marcela Torres', detalle: 'Equipo recibido con cargador original.' },
        { fecha: '2026-10-26T11:30:00', estado: 'EN_DIAGNOSTICO', responsable: 'Marcela Torres', detalle: 'Asignada a Julio Quispe.' },
      ],
    },
    {
      id: 2, codigo: 'ST-0002', clienteId: 2, equipoId: 2,
      falla: 'Se reinicia solo al abrir programas pesados.',
      accesorios: 'Cable de poder',
      estado: 'RECIBIDO',
      historial: [
        { fecha: '2026-10-28T08:45:00', estado: 'RECIBIDO', responsable: 'Marcela Torres', detalle: 'Equipo recibido con cable de poder.' },
      ],
    },
    {
      id: 3, codigo: 'ST-0003', clienteId: 1, equipoId: 3, tecnicoId: 3,
      falla: 'El sistema tarda mucho en iniciar y se congela.',
      accesorios: 'Cargador y mochila',
      estado: 'PRESUPUESTO_ENVIADO',
      diagnostico: 'Disco duro con sectores dañados. Se recomienda cambiarlo por una unidad SSD y reinstalar el sistema.',
      montoPresupuesto: 280,
      historial: [
        { fecha: '2026-10-24T10:00:00', estado: 'RECIBIDO', responsable: 'Marcela Torres', detalle: 'Equipo recibido con cargador y mochila.' },
        { fecha: '2026-10-24T12:15:00', estado: 'EN_DIAGNOSTICO', responsable: 'Marcela Torres', detalle: 'Asignada a Carla Vera.' },
        { fecha: '2026-10-25T16:40:00', estado: 'PRESUPUESTO_ENVIADO', responsable: 'Carla Vera', detalle: 'Presupuesto de S/ 280.00 enviado al cliente.' },
      ],
    },
    {
      id: 4, codigo: 'ST-0004', clienteId: 3, equipoId: 4, tecnicoId: 2,
      falla: 'Imprime con manchas y aparece luz roja de error.',
      accesorios: 'Cable USB',
      estado: 'EN_REPARACION',
      diagnostico: 'Almohadillas de tinta saturadas. Requiere mantenimiento y reinicio del contador.',
      montoPresupuesto: 90,
      decision: 'APROBADO',
      actividad: 'Limpieza de cabezal y reemplazo de almohadillas.',
      historial: [
        { fecha: '2026-10-22T09:30:00', estado: 'RECIBIDO', responsable: 'Marcela Torres', detalle: 'Equipo recibido con cable USB.' },
        { fecha: '2026-10-22T10:00:00', estado: 'EN_DIAGNOSTICO', responsable: 'Marcela Torres', detalle: 'Asignada a Julio Quispe.' },
        { fecha: '2026-10-23T15:20:00', estado: 'PRESUPUESTO_ENVIADO', responsable: 'Julio Quispe', detalle: 'Presupuesto de S/ 90.00 enviado al cliente.' },
        { fecha: '2026-10-23T18:05:00', estado: 'EN_REPARACION', responsable: 'Pedro Salinas Cruz', detalle: 'El cliente aprobó el presupuesto.' },
      ],
    },
    {
      id: 5, codigo: 'ST-0005', clienteId: 2, equipoId: 5, tecnicoId: 4,
      falla: 'La pantalla se ve en negro, aunque el equipo enciende.',
      accesorios: 'Cargador',
      estado: 'LISTO_PARA_ENTREGA',
      diagnostico: 'Cable flex de pantalla suelto. Se reconectó y se aseguró.',
      montoPresupuesto: 60,
      decision: 'APROBADO',
      actividad: 'Reconexión y fijación del cable flex de pantalla.',
      repuestos: 'Ninguno',
      pruebas: 'Encendido, pantalla y teclado sin fallas durante 30 minutos.',
      historial: [
        { fecha: '2026-10-20T11:00:00', estado: 'RECIBIDO', responsable: 'Marcela Torres', detalle: 'Equipo recibido con cargador.' },
        { fecha: '2026-10-20T11:20:00', estado: 'EN_DIAGNOSTICO', responsable: 'Marcela Torres', detalle: 'Asignada a Rolando Díaz.' },
        { fecha: '2026-10-21T10:10:00', estado: 'PRESUPUESTO_ENVIADO', responsable: 'Rolando Díaz', detalle: 'Presupuesto de S/ 60.00 enviado al cliente.' },
        { fecha: '2026-10-21T12:00:00', estado: 'EN_REPARACION', responsable: 'Ana Rojas Vega', detalle: 'El cliente aprobó el presupuesto.' },
        { fecha: '2026-10-22T17:30:00', estado: 'LISTO_PARA_ENTREGA', responsable: 'Rolando Díaz', detalle: 'Reparación y pruebas completadas.' },
      ],
    },
  ]);

  // ---------- Consultas ----------

  obtenerOrden(id: number): Orden | undefined {
    return this.ordenes().find((o) => o.id === id);
  }

  buscarClientePorDni(dni: string): Cliente | undefined {
    return this.clientes().find((c) => c.dni === dni);
  }

  cliente(id: number): Cliente | undefined {
    return this.clientes().find((c) => c.id === id);
  }

  equipo(id: number): Equipo | undefined {
    return this.equipos().find((e) => e.id === id);
  }

  tecnicos(): Usuario[] {
    return this.usuarios().filter((u) => u.rol === 'TECNICO');
  }

  nombreTecnico(id?: number): string {
    return this.usuarios().find((u) => u.id === id)?.nombre ?? 'Sin asignar';
  }

  descripcionEquipo(id: number): string {
    const e = this.equipo(id);
    return e ? `${e.tipo} ${e.marca} ${e.modelo}` : '';
  }

  // ---------- Operaciones del flujo de atención ----------

  /** Recepción: registra cliente (si es nuevo), equipo y orden. Devuelve la orden o un mensaje de error. */
  registrarRecepcion(
    dni: string,
    nuevoCliente: { nombres: string; correo: string; telefono: string } | null,
    equipo: { tipo: string; marca: string; modelo: string; serie: string },
    falla: string,
    accesorios: string,
    responsable: string,
  ): { orden?: Orden; error?: string } {
    let cliente = this.buscarClientePorDni(dni);
    if (!cliente) {
      if (!nuevoCliente) {
        return { error: 'El cliente no existe; complete sus datos.' };
      }
      cliente = { id: this.clientes().length + 1, dni, ...nuevoCliente };
      this.clientes.update((lista) => [...lista, cliente!]);
    }

    // Regla: no se permite otra orden abierta del mismo equipo.
    let equipoReg = this.equipos().find(
      (e) => e.clienteId === cliente!.id && equipo.serie !== '' && e.serie === equipo.serie,
    );
    if (equipoReg) {
      const abierta = this.ordenes().some(
        (o) => o.equipoId === equipoReg!.id && o.estado !== 'ENTREGADO',
      );
      if (abierta) {
        return { error: 'Este equipo ya tiene una orden abierta.' };
      }
    } else {
      equipoReg = { id: this.equipos().length + 1, clienteId: cliente.id, ...equipo };
      this.equipos.update((lista) => [...lista, equipoReg!]);
    }

    const numero = this.ordenes().length + 1;
    const orden: Orden = {
      id: numero,
      codigo: 'ST-' + String(numero).padStart(4, '0'),
      clienteId: cliente.id,
      equipoId: equipoReg.id,
      falla,
      accesorios,
      estado: 'RECIBIDO',
      historial: [
        this.movimiento('RECIBIDO', responsable, `Equipo recibido. Accesorios: ${accesorios || 'ninguno'}.`),
      ],
    };
    this.ordenes.update((lista) => [orden, ...lista]);
    return { orden };
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

  // ---------- Auxiliares ----------

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
}