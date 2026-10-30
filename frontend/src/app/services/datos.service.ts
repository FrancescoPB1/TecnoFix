import { Injectable, signal } from '@angular/core';
import {
  Cliente,
  Equipo,
  EstadoOrden,
  Marca,
  MovimientoOrden,
  Orden,
  Rol,
  Usuario,
} from '../models/modelos';

/**
 * Data Service del prototipo.
 * Guarda los datos de ejemplo en memoria con signals
 */
@Injectable({ providedIn: 'root' })
export class DatosService {
  readonly usuarios = signal<Usuario[]>([
        { id: 1, nombre: 'Marcela Torres', usuario: 'recepcion', clave: 'demo123', rol: 'RECEPCION', activo: true, dni: '40125478', telefono: '944100200', correo: 'marcela.torres@correo.com' },
    { id: 2, nombre: 'Julio Quispe', usuario: 'tecnico1', clave: 'demo123', rol: 'TECNICO', activo: true, dni: '41236587', telefono: '955200300', correo: 'julio.quispe@correo.com', especialidad: 'Laptops' },
    { id: 3, nombre: 'Carla Vera', usuario: 'tecnico2', clave: 'demo123', rol: 'TECNICO', activo: true, dni: '42587963', telefono: '966300400', correo: 'carla.vera@correo.com', especialidad: 'PC de escritorio' },
    { id: 4, nombre: 'Rolando Díaz', usuario: 'tecnico3', clave: 'demo123', rol: 'TECNICO', activo: true, dni: '43698521', telefono: '977400500', correo: 'rolando.diaz@correo.com', especialidad: 'Impresoras y monitores' },
    { id: 5, nombre: 'Luis Paredes Rojas', usuario: 'cliente1', clave: 'demo123', rol: 'CLIENTE', activo: true, clienteId: 1 },
    { id: 6, nombre: 'Ana Rojas Vega', usuario: 'cliente2', clave: 'demo123', rol: 'CLIENTE', activo: true, clienteId: 2 },
    { id: 7, nombre: 'Ricardo Salazar', usuario: 'admin', clave: 'demo123', rol: 'ADMIN', activo: true, dni: '40789654', telefono: '988500600', correo: 'ricardo.salazar@correo.com' },
  ]);

  readonly marcas = signal<Marca[]>([
    { id: 1, nombre: 'HP' },
    { id: 2, nombre: 'Dell' },
    { id: 3, nombre: 'Lenovo' },
    { id: 4, nombre: 'Epson' },
    { id: 5, nombre: 'Acer' },
    { id: 6, nombre: 'Asus' },
    { id: 7, nombre: 'Samsung' },
    { id: 8, nombre: 'Canon' },
  ]);

  readonly clientes = signal<Cliente[]>([
    { id: 1, dni: '45871236', nombres: 'Luis Paredes Rojas', correo: 'luis.paredes@correo.com', telefono: '987654321' },
    { id: 2, dni: '72418596', nombres: 'Ana Rojas Vega', correo: 'ana.rojas@correo.com', telefono: '945123678' },
    { id: 3, dni: '41256387', nombres: 'Pedro Salinas Cruz', correo: 'pedro.salinas@correo.com', telefono: '912345987' },
  ]);

  readonly equipos = signal<Equipo[]>([
    { id: 1, clienteId: 1, tipo: 'Laptop', marcaId: 1, modelo: 'Pavilion 15', serie: '5CD1234ABC' },
    { id: 2, clienteId: 2, tipo: 'PC de escritorio', marcaId: 3, modelo: 'ThinkCentre M70', serie: 'PC-77412' },
    { id: 3, clienteId: 1, tipo: 'Laptop', marcaId: 2, modelo: 'Inspiron 3501', serie: 'DL-8842' },
    { id: 4, clienteId: 3, tipo: 'Impresora', marcaId: 4, modelo: 'L3150', serie: 'EP-30551' },
    { id: 5, clienteId: 2, tipo: 'Laptop', marcaId: 3, modelo: 'IdeaPad 3', serie: 'LN-90217' },
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

  /** Técnicos activos: son los que se pueden elegir al asignar una orden. */
  tecnicos(): Usuario[] {
    return this.usuarios().filter((u) => u.rol === 'TECNICO' && u.activo);
  }

  /** Personal que administra el sistema desde la pantalla de usuarios. */
  personal(): Usuario[] {
    return this.usuarios().filter((u) => u.rol === 'RECEPCION' || u.rol === 'TECNICO');
  }

  nombreMarca(id: number): string {
    return this.marcas().find((m) => m.id === id)?.nombre ?? '';
  }

  cantidadEquiposDeMarca(id: number): number {
    return this.equipos().filter((e) => e.marcaId === id).length;
  }

  nombreTecnico(id?: number): string {
    return this.usuarios().find((u) => u.id === id)?.nombre ?? 'Sin asignar';
  }

  descripcionEquipo(id: number): string {
    const e = this.equipo(id);
    return e ? `${e.tipo} ${this.nombreMarca(e.marcaId)} ${e.modelo}` : '';
  }

  // ---------- Operaciones del flujo de atención ----------

  /**
   * Recepción: registra cliente (si es nuevo), equipo y orden. Si el cliente es nuevo también se
   * crea su acceso (usuario = DNI y una clave temporal). Devuelve la orden o un mensaje de error.
   */
  registrarRecepcion(
    dni: string,
    nuevoCliente: { nombres: string; correo: string; telefono: string } | null,
    equipo: { tipo: string; marcaId: number; modelo: string; serie: string },
    falla: string,
    accesorios: string,
    responsable: string,
  ): { orden?: Orden; accesoCliente?: { usuario: string; clave: string }; error?: string } {
    let accesoCliente: { usuario: string; clave: string } | undefined;
    let cliente = this.buscarClientePorDni(dni);
    if (!cliente) {
      if (!nuevoCliente) {
        return { error: 'El cliente no existe; complete sus datos.' };
      }
      cliente = { id: this.clientes().length + 1, dni, ...nuevoCliente };
      this.clientes.update((lista) => [...lista, cliente!]);

      // Acceso del cliente: lo crea recepción al registrarlo, así solo entran quienes dejaron un equipo.
      accesoCliente = { usuario: dni, clave: 'tf' + dni.slice(-4) };
      this.usuarios.update((lista) => [
        ...lista,
        {
          id: this.siguienteIdUsuario(),
          nombre: cliente!.nombres,
          usuario: accesoCliente!.usuario,
          clave: accesoCliente!.clave,
          rol: 'CLIENTE',
          activo: true,
          clienteId: cliente!.id,
        },
      ]);
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
    return { orden, accesoCliente };
  }

  // ---------- Marcas (catálogo) ----------

  agregarMarca(nombre: string): { error?: string } {
    const limpio = nombre.trim();
    if (limpio.length < 2) {
      return { error: 'El nombre de la marca debe tener al menos 2 caracteres.' };
    }
    if (this.marcas().some((m) => m.nombre.toLowerCase() === limpio.toLowerCase())) {
      return { error: `La marca ${limpio} ya está registrada.` };
    }
    const id = Math.max(0, ...this.marcas().map((m) => m.id)) + 1;
    this.marcas.update((lista) => [...lista, { id, nombre: limpio }]);
    return {};
  }

  eliminarMarca(id: number): { error?: string } {
    if (this.cantidadEquiposDeMarca(id) > 0) {
      return { error: 'No se puede eliminar: hay equipos registrados con esa marca.' };
    }
    this.marcas.update((lista) => lista.filter((m) => m.id !== id));
    return {};
  }

  // ---------- Personal (usuarios de recepción y técnicos) ----------

  registrarPersonal(datos: {
    rol: Rol;
    nombre: string;
    dni: string;
    telefono: string;
    correo: string;
    especialidad: string;
    usuario: string;
    clave: string;
  }): { error?: string } {
    const usuario = datos.usuario.trim();
    if (this.usuarios().some((u) => u.usuario.toLowerCase() === usuario.toLowerCase())) {
      return { error: `El usuario ${usuario} ya existe.` };
    }
    if (this.personal().some((u) => u.dni === datos.dni)) {
      return { error: 'Ya hay una persona del personal registrada con ese DNI.' };
    }
    const nuevo: Usuario = {
      id: this.siguienteIdUsuario(),
      nombre: datos.nombre.trim(),
      usuario,
      clave: datos.clave,
      rol: datos.rol,
      activo: true,
      dni: datos.dni,
      telefono: datos.telefono,
      correo: datos.correo.trim(),
      especialidad: datos.rol === 'TECNICO' ? datos.especialidad.trim() : undefined,
    };
    this.usuarios.update((lista) => [...lista, nuevo]);
    return {};
  }

  /** Activa o desactiva una cuenta del personal (una cuenta inactiva no puede iniciar sesión). */
  cambiarEstadoUsuario(id: number): void {
    this.usuarios.update((lista) => lista.map((u) => (u.id === id ? { ...u, activo: !u.activo } : u)));
  }

  // ---------- Flujo de la orden ----------

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
}