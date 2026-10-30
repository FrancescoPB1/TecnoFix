# TecnoFix - Sistema web de gestión de órdenes de servicio técnico

Proyecto del curso **Soluciones Web y Aplicaciones Distribuidas** (SIST1402A) - UPN, periodo 2026-5.

TecnoFix es un centro de servicio técnico de computadoras, laptops e impresoras. Hoy el control de los equipos
se lleva en cuaderno y WhatsApp; el sistema registra cada equipo que ingresa, lo asigna a un técnico,
envía el presupuesto al cliente para su aprobación y deja constancia de la entrega.

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

| Usuario | Rol | Qué puede hacer |
|---|---|---|
| `admin` | Administrador | Gestionar usuarios (administradores, recepción y técnicos), mantener los catálogos de marcas y tipos de equipo, consultar clientes y supervisar el panel de órdenes |
| `recepcion` | Recepción | Registrar clientes y equipos, ver y corregir los datos de los clientes, asignar técnicos y registrar entregas |
| `tecnico1` (también `tecnico2`, `tecnico3`) | Técnico | Diagnosticar, enviar presupuesto y registrar la reparación |
| `cliente1` (también `cliente2`) | Cliente | Ver el seguimiento de sus órdenes y aprobar o rechazar el presupuesto |

Los clientes no se registran solos: recepción los registra (desde la pantalla Clientes o al recibir su equipo) y el sistema
crea su acceso (usuario = DNI y una clave temporal que se muestra en pantalla para entregársela). Si un cliente olvida su
clave, recepción la restablece desde la misma pantalla.

## Flujo de una orden

`Recibido` -> `En diagnóstico` -> `Presupuesto enviado` -> (aprobado) `En reparación` -> `Listo para entrega` -> `Entregado`

Si el cliente rechaza el presupuesto, la orden pasa a `Devuelto sin reparar` y se entrega el equipo sin reparar.
Regla de negocio: un mismo equipo (mismo cliente y serie) no puede tener dos órdenes abiertas a la vez.