# TecnoFix - Sistema web de gestión de órdenes de servicio técnico para una red de sedes

Proyecto del curso **Soluciones Web y Aplicaciones Distribuidas** (SIST1402A) - UPN, periodo 2026-2.

## Caso de estudio

El proyecto se plantea sobre el **servicio técnico (postventa) de una marca de electrónica de consumo con presencia
nacional**; el caso de estudio es la red de centros de servicio de **Samsung Perú**. Es un ejercicio académico: no es un
sistema oficial de la marca, no usa su logo y **los datos del prototipo (sedes, personal, clientes, equipos y órdenes) son
ficticios**. Las cifras de operación que se citan en el informe son fuentes públicas o supuestos del caso, indicados como tales.

TecnoFix reemplaza el control disperso de equipos (hojas de cálculo, mensajes y llamadas) por un solo sistema para toda la red:
cada **sede** recibe y atiende sus equipos, el administrador general ve todas las sedes, el sistema verifica la **garantía** con la
fecha de compra y el cliente puede seguir su orden desde la web.

## Estado del proyecto

| Entrega | Contenido | Estado |
|---|---|---|
| Semana 2 | Cap. 1 (planteamiento del problema) y Cap. 2 (propuesta de interfaz y UX) con **prototipo frontend** | Hecho |
| Semanas 3-8 | Modelo de datos, API REST (Spring Boot + JPA), seguridad JWT, integración, despliegue | Pendiente |

El prototipo actual usa **datos de ejemplo en memoria** (todavía no hay backend ni base de datos). Al recargar la
página los datos vuelven a su estado inicial; la sesión se guarda solo en `sessionStorage`.

## Estructura del repositorio

```
frontend/        Aplicación Angular + Bootstrap (prototipo)
docs/capturas/   Capturas del prototipo usadas en el informe (Cap. 2)
```

La carpeta `backend/` (Spring Boot) se agregará en las siguientes entregas.

## Tecnologías

- Angular 22 (componentes standalone, signals, Router con guards, formularios por plantilla)
- Bootstrap 5 y Bootstrap Icons (solo CSS, diseño responsive)
- Spring Boot, Spring Data JPA, Spring Security + JWT y Swagger (planificado para el backend)

## Cómo ejecutar el frontend

Requisito: Node.js `^22.22.3`, `^24.15.0` o superior (lo exige Angular 22). Verifique con `node -v`.

```bash
cd frontend
npm install
npm start
```

Abrir <http://localhost:4200>.

## Roles y cuentas de prueba (clave: `demo123`)

| Usuario | Rol | Sede | Qué puede hacer |
|---|---|---|---|
| `admin` | Administrador general | Todas | Ver el panel de todas las sedes, registrar y editar sedes, gestionar el personal (administradores, recepción y técnicos), mantener los tipos de equipo y consultar clientes |
| `recepcion` | Recepción | Lima Centro | Registrar clientes y equipos de su sede, ver y corregir los datos de los clientes, asignar técnicos de su sede y registrar entregas |
| `recepcion2`, `recepcion3` | Recepción | Lima Norte, Trujillo | Igual que `recepcion`, en su sede |
| `tecnico1`, `tecnico2` | Técnico | Lima Centro | Diagnosticar, enviar presupuesto y registrar la reparación |
| `tecnico3`, `tecnico4` | Técnico | Trujillo, Lima Norte | Igual que los anteriores, en su sede |
| `cliente1` (también `cliente2`) | Cliente | - | Ver el seguimiento de sus órdenes (en cualquier sede) y aprobar o rechazar el presupuesto |

Los clientes no se registran solos: recepción los registra (desde la pantalla Clientes o al recibir su equipo) y el sistema
crea su acceso (usuario = DNI y una clave temporal que se muestra en pantalla para entregársela). Si un cliente olvida su
clave, recepción la restablece desde la misma pantalla.

## Flujo de una orden

`Recibido` -> `En diagnóstico` -> `Presupuesto enviado` -> (aprobado) `En reparación` -> `Listo para entrega` -> `Entregado`

- Si el cliente rechaza el presupuesto, la orden pasa a `Devuelto sin reparar` y se entrega el equipo sin reparar.
- **Garantía:** recepción registra la fecha de compra y el sistema calcula si el equipo está en garantía (el prototipo asume
  12 meses). Si lo está, el técnico solo registra el diagnóstico y la orden pasa directo a `En reparación`, sin costo ni
  aprobación del cliente.
- Cada orden pertenece a la sede donde se recibió: recepción solo ve y entrega las órdenes de su sede y las asigna a técnicos
  de esa sede.
- Regla de negocio: un mismo equipo (mismo cliente y serie o IMEI) no puede tener dos órdenes abiertas a la vez.