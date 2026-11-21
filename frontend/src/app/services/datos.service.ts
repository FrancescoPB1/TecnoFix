import { Injectable, signal } from '@angular/core';
import {
  Cliente,
  Equipo,
  EstadoOrden,
  Marca,
  MovimientoOrden,
  Orden,
  Rol,
  Sede,
  TipoEquipo,
  Usuario,
} from '../models/modelos';


@Injectable({ providedIn: 'root' })
export class DatosService {
  readonly sedes = signal<Sede[]>([
    { id: 1, nombre: 'Lima Centro', ciudad: 'Lima', telefono: '014000101', activa: true },
    { id: 2, nombre: 'Lima Norte', ciudad: 'Lima', telefono: '014000102', activa: true },
    { id: 3, nombre: 'Trujillo', ciudad: 'Trujillo', telefono: '044000103', activa: true },
  ]);

  readonly usuarios = signal<Usuario[]>([
    { id: 1, nombre: 'Marcela Torres', usuario: 'recepcion', clave: 'demo123', rol: 'RECEPCION', activo: true, sedeId: 1, dni: '40125478', telefono: '944100200', correo: 'marcela.torres@correo.com' },
    { id: 2, nombre: 'Julio Quispe', usuario: 'tecnico1', clave: 'demo123', rol: 'TECNICO', activo: true, sedeId: 1, dni: '41236587', telefono: '955200300', correo: 'julio.quispe@correo.com', especialidad: 'Celulares y tablets' },
    { id: 3, nombre: 'Carla Vera', usuario: 'tecnico2', clave: 'demo123', rol: 'TECNICO', activo: true, sedeId: 1, dni: '42587963', telefono: '966300400', correo: 'carla.vera@correo.com', especialidad: 'Laptops' },
    { id: 4, nombre: 'Rolando Díaz', usuario: 'tecnico3', clave: 'demo123', rol: 'TECNICO', activo: true, sedeId: 3, dni: '43698521', telefono: '977400500', correo: 'rolando.diaz@correo.com', especialidad: 'Línea blanca' },
    { id: 5, nombre: 'Luis Paredes Rojas', usuario: 'cliente1', clave: 'demo123', rol: 'CLIENTE', activo: true, clienteId: 1 },
    { id: 6, nombre: 'Ana Rojas Vega', usuario: 'cliente2', clave: 'demo123', rol: 'CLIENTE', activo: true, clienteId: 2 },
    { id: 7, nombre: 'Ricardo Salazar', usuario: 'admin', clave: 'demo123', rol: 'ADMIN', activo: true, dni: '40789654', telefono: '988500600', correo: 'ricardo.salazar@correo.com' },
    { id: 8, nombre: 'Diego Alarcón', usuario: 'recepcion2', clave: 'demo123', rol: 'RECEPCION', activo: true, sedeId: 2, dni: '44125896', telefono: '933600700', correo: 'diego.alarcon@correo.com' },
    { id: 9, nombre: 'Patricia Lozano', usuario: 'recepcion3', clave: 'demo123', rol: 'RECEPCION', activo: true, sedeId: 3, dni: '45236987', telefono: '922700800', correo: 'patricia.lozano@correo.com' },
    { id: 10, nombre: 'Mónica Ruiz', usuario: 'tecnico4', clave: 'demo123', rol: 'TECNICO', activo: true, sedeId: 2, dni: '46321458', telefono: '911800900', correo: 'monica.ruiz@correo.com', especialidad: 'Televisores' },
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

  readonly tiposEquipo = signal<TipoEquipo[]>([
    { id: 1, nombre: 'Laptop' },
    { id: 2, nombre: 'PC de escritorio' },
    { id: 3, nombre: 'Impresora' },
    { id: 4, nombre: 'Monitor' },
    { id: 5, nombre: 'Otro' },
  ]);

  readonly clientes = signal<Cliente[]>([
    { id: 1, dni: '45871236', nombres: 'Luis Paredes Rojas', correo: 'luis.paredes@correo.com', telefono: '987654321' },
    { id: 2, dni: '72418596', nombres: 'Ana Rojas Vega', correo: 'ana.rojas@correo.com', telefono: '945123678' },
    { id: 3, dni: '41256387', nombres: 'Pedro Salinas Cruz', correo: 'pedro.salinas@correo.com', telefono: '912345987' },
  ]);

  readonly equipos = signal<Equipo[]>([
    { id: 1, clienteId: 1, tipoId: 1, marcaId: 1, modelo: 'Pavilion 15', serie: '5CD1234ABC' },
    { id: 2, clienteId: 2, tipoId: 2, marcaId: 3, modelo: 'ThinkCentre M70', serie: 'PC-77412' },
    { id: 3, clienteId: 1, tipoId: 1, marcaId: 2, modelo: 'Inspiron 3501', serie: 'DL-8842' },
    { id: 4, clienteId: 3, tipoId: 3, marcaId: 4, modelo: 'L3150', serie: 'EP-30551' },
    { id: 5, clienteId: 2, tipoId: 1, marcaId: 3, modelo: 'IdeaPad 3', serie: 'LN-90217' },
  ]);

  readonly ordenes = signal<Orden[]>([
    {
      id: 1, codigo: 'ST-0001', clienteId: 1, equipoId: 1, sedeId: 1, tecnicoId: 2,
      falla: 'No enciende; a veces parpadea el LED de carga.',
      accesorios: 'Cargador original',
      estado: 'EN_DIAGNOSTICO',
      historial: [
        { fecha: '2026-10-26T09:10:00', estado: 'RECIBIDO', responsable: 'Marcela Torres', detalle: 'Equipo recibido con cargador original.' },
        { fecha: '2026-10-26T11:30:00', estado: 'EN_DIAGNOSTICO', responsable: 'Marcela Torres', detalle: 'Asignada a Julio Quispe.' },
      ],
    },
    {
      id: 2, codigo: 'ST-0002', clienteId: 2, equipoId: 2, sedeId: 2,
      falla: 'Se reinicia solo al abrir programas pesados.',
      accesorios: 'Cable de poder',
      estado: 'RECIBIDO',
      historial: [
        { fecha: '2026-10-28T08:45:00', estado: 'RECIBIDO', responsable: 'Diego Alarcón', detalle: 'Equipo recibido con cable de poder.' },
      ],
    },
    {
      id: 3, codigo: 'ST-0003', clienteId: 1, equipoId: 3, sedeId: 1, tecnicoId: 3,
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
      id: 4, codigo: 'ST-0004', clienteId: 3, equipoId: 4, sedeId: 3, tecnicoId: 4,
      falla: 'Imprime con manchas y aparece luz roja de error.',
      accesorios: 'Cable USB',
      estado: 'EN_REPARACION',
      diagnostico: 'Almohadillas de tinta saturadas. Requiere mantenimiento y reinicio del contador.',
      montoPresupuesto: 90,
      decision: 'APROBADO',
      actividad: 'Limpieza de cabezal y reemplazo de almohadillas.',
      historial: [
        { fecha: '2026-10-22T09:30:00', estado: 'RECIBIDO', responsable: 'Patricia Lozano', detalle: 'Equipo recibido con cable USB.' },
        { fecha: '2026-10-22T10:00:00', estado: 'EN_DIAGNOSTICO', responsable: 'Patricia Lozano', detalle: 'Asignada a Rolando Díaz.' },
        { fecha: '2026-10-23T15:20:00', estado: 'PRESUPUESTO_ENVIADO', responsable: 'Rolando Díaz', detalle: 'Presupuesto de S/ 90.00 enviado al cliente.' },
        { fecha: '2026-10-23T18:05:00', estado: 'EN_REPARACION', responsable: 'Pedro Salinas Cruz', detalle: 'El cliente aprobó el presupuesto.' },
      ],
    },
    {
      id: 5, codigo: 'ST-0005', clienteId: 2, equipoId: 5, sedeId: 2, tecnicoId: 10,
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
        { fecha: '2026-10-20T11:00:00', estado: 'RECIBIDO', responsable: 'Diego Alarcón', detalle: 'Equipo recibido con cargador.' },
        { fecha: '2026-10-20T11:20:00', estado: 'EN_DIAGNOSTICO', responsable: 'Diego Alarcón', detalle: 'Asignada a Mónica Ruiz.' },
        { fecha: '2026-10-21T10:10:00', estado: 'PRESUPUESTO_ENVIADO', responsable: 'Mónica Ruiz', detalle: 'Presupuesto de S/ 60.00 enviado al cliente.' },
        { fecha: '2026-10-21T12:00:00', estado: 'EN_REPARACION', responsable: 'Ana Rojas Vega', detalle: 'El cliente aprobó el presupuesto.' },
        { fecha: '2026-10-22T17:30:00', estado: 'LISTO_PARA_ENTREGA', responsable: 'Mónica Ruiz', detalle: 'Reparación y pruebas completadas.' },
      ],
    },
  ]);


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

  nombreMarca(id: number): string {
    return this.marcas().find((m) => m.id === id)?.nombre ?? '';
  }

  cantidadEquiposDeMarca(id: number): number {
    return this.equipos().filter((e) => e.marcaId === id).length;
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
    return e ? `${this.nombreTipo(e.tipoId)} ${this.nombreMarca(e.marcaId)} ${e.modelo}` : '';
  }



  registrarRecepcion(
    dni: string,
    nuevoCliente: { nombres: string; correo: string; telefono: string } | null,
    equipo: { tipoId: number; marcaId: number; modelo: string; serie: string },
    falla: string,
    accesorios: string,
    responsable: string,
    sedeId: number,
  ): { orden?: Orden; accesoCliente?: { usuario: string; clave: string }; error?: string } {
    let accesoCliente: { usuario: string; clave: string } | undefined;
    let cliente = this.buscarClientePorDni(dni);
    if (!cliente) {
      if (!nuevoCliente) {
        return { error: 'El cliente no existe; complete sus datos.' };
      }
      const creado = this.crearCliente({ dni, ...nuevoCliente });
      if (creado.error) {
        return { error: creado.error };
      }
      cliente = creado.cliente!;
      accesoCliente = creado.acceso;
    }

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
      sedeId,
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


  crearCliente(datos: {
    dni: string;
    nombres: string;
    correo: string;
    telefono: string;
  }): { cliente?: Cliente; acceso?: { usuario: string; clave: string }; error?: string } {
    if (this.buscarClientePorDni(datos.dni)) {
      return { error: `Ya existe un cliente con el DNI ${datos.dni}.` };
    }
    if (this.usuarios().some((u) => u.usuario === datos.dni)) {
      return { error: `El usuario ${datos.dni} ya existe en el sistema.` };
    }
    const cliente: Cliente = {
      id: Math.max(0, ...this.clientes().map((c) => c.id)) + 1,
      dni: datos.dni,
      nombres: datos.nombres.trim(),
      correo: datos.correo.trim(),
      telefono: datos.telefono,
    };
    this.clientes.update((lista) => [...lista, cliente]);

    const acceso = { usuario: datos.dni, clave: this.claveTemporalCliente(datos.dni) };
    this.usuarios.update((lista) => [
      ...lista,
      {
        id: this.siguienteIdUsuario(),
        nombre: cliente.nombres,
        usuario: acceso.usuario,
        clave: acceso.clave,
        rol: 'CLIENTE',
        activo: true,
        clienteId: cliente.id,
      },
    ]);
    return { cliente, acceso };
  }

  actualizarCliente(id: number, datos: { nombres: string; correo: string; telefono: string }): void {
    const nombres = datos.nombres.trim();
    this.clientes.update((lista) =>
      lista.map((c) => (c.id === id ? { ...c, nombres, correo: datos.correo.trim(), telefono: datos.telefono } : c)),
    );
    this.usuarios.update((lista) =>
      lista.map((u) => (u.rol === 'CLIENTE' && u.clienteId === id ? { ...u, nombre: nombres } : u)),
    );
  }

  restablecerClaveCliente(clienteId: number): { usuario: string; clave: string } | undefined {
    const acceso = this.accesoDeCliente(clienteId);
    const cliente = this.cliente(clienteId);
    if (!acceso || !cliente) {
      return undefined;
    }
    const clave = this.claveTemporalCliente(cliente.dni);
    this.usuarios.update((lista) => lista.map((u) => (u.id === acceso.id ? { ...u, clave } : u)));
    return { usuario: acceso.usuario, clave };
  }


  cantidadOrdenesAbiertasDeSede(id: number): number {
    return this.ordenes().filter((o) => o.sedeId === id && o.estado !== 'ENTREGADO').length;
  }

  agregarSede(datos: { nombre: string; ciudad: string; telefono: string }): { error?: string } {
    const nombre = datos.nombre.trim();
    if (this.sedes().some((s) => s.nombre.toLowerCase() === nombre.toLowerCase())) {
      return { error: `Ya existe una sede llamada ${nombre}.` };
    }
    const id = Math.max(0, ...this.sedes().map((s) => s.id)) + 1;
    this.sedes.update((lista) => [
      ...lista,
      { id, nombre, ciudad: datos.ciudad.trim(), telefono: datos.telefono, activa: true },
    ]);
    return {};
  }

  actualizarSede(id: number, datos: { nombre: string; ciudad: string; telefono: string }): { error?: string } {
    const nombre = datos.nombre.trim();
    if (this.sedes().some((s) => s.id !== id && s.nombre.toLowerCase() === nombre.toLowerCase())) {
      return { error: `Ya existe una sede llamada ${nombre}.` };
    }
    this.sedes.update((lista) =>
      lista.map((s) => (s.id === id ? { ...s, nombre, ciudad: datos.ciudad.trim(), telefono: datos.telefono } : s)),
    );
    return {};
  }

  cambiarEstadoSede(id: number): { error?: string } {
    const sede = this.sede(id);
    if (sede?.activa && this.cantidadOrdenesAbiertasDeSede(id) > 0) {
      return { error: 'No se puede desactivar: la sede tiene órdenes sin entregar.' };
    }
    this.sedes.update((lista) => lista.map((s) => (s.id === id ? { ...s, activa: !s.activa } : s)));
    return {};
  }


  agregarTipoEquipo(nombre: string): { error?: string } {
    const limpio = nombre.trim();
    if (limpio.length < 2) {
      return { error: 'El nombre del tipo debe tener al menos 2 caracteres.' };
    }
    if (this.tiposEquipo().some((t) => t.nombre.toLowerCase() === limpio.toLowerCase())) {
      return { error: `El tipo ${limpio} ya está registrado.` };
    }
    const id = Math.max(0, ...this.tiposEquipo().map((t) => t.id)) + 1;
    this.tiposEquipo.update((lista) => [...lista, { id, nombre: limpio }]);
    return {};
  }

  eliminarTipoEquipo(id: number): { error?: string } {
    if (this.cantidadEquiposDeTipo(id) > 0) {
      return { error: 'No se puede eliminar: hay equipos registrados con ese tipo.' };
    }
    this.tiposEquipo.update((lista) => lista.filter((t) => t.id !== id));
    return {};
  }


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
      sedeId: datos.rol === 'ADMIN' ? undefined : (datos.sedeId ?? undefined),
      dni: datos.dni,
      telefono: datos.telefono,
      correo: datos.correo.trim(),
      especialidad: datos.rol === 'TECNICO' ? datos.especialidad.trim() : undefined,
    };
    this.usuarios.update((lista) => [...lista, nuevo]);
    return {};
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
  ): { error?: string } {
    if (this.personal().some((u) => u.id !== id && u.dni === datos.dni)) {
      return { error: 'Ya hay una persona del personal registrada con ese DNI.' };
    }
    this.usuarios.update((lista) =>
      lista.map((u) =>
        u.id !== id
          ? u
          : {
              ...u,
              sedeId: u.rol === 'ADMIN' ? undefined : (datos.sedeId ?? undefined),
              nombre: datos.nombre.trim(),
              dni: datos.dni,
              telefono: datos.telefono,
              correo: datos.correo.trim(),
              especialidad: u.rol === 'TECNICO' ? datos.especialidad.trim() : undefined,
              clave: datos.clave ? datos.clave : u.clave,
            },
      ),
    );
    return {};
  }

  cambiarEstadoUsuario(id: number): void {
    this.usuarios.update((lista) => lista.map((u) => (u.id === id ? { ...u, activo: !u.activo } : u)));
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
}