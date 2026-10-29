# TecnoFix - Sistema web de gestion de ordenes de servicio tecnico

Proyecto del curso **Soluciones Web y Aplicaciones Distribuidas** (SIST1402A) - UPN, periodo 2026-5.

TecnoFix es un centro de servicio tecnico de computadoras, laptops e impresoras. Hoy el control de los equipos
se lleva en cuaderno y WhatsApp; el sistema busca registrar cada equipo que ingresa, asignarlo a un tecnico,
enviar el presupuesto al cliente para su aprobacion y dejar constancia de la entrega.

## Estado del proyecto

| Entrega | Contenido | Estado |
|---|---|---|
| Semana 2 | Cap. 1 (planteamiento del problema) y Cap. 2 (propuesta de interfaz y UX) con **prototipo frontend** | Hecho |
| Semanas 3-8 | Modelo de datos, API REST (Spring Boot + JPA), seguridad JWT, integracion, despliegue | Pendiente |

El prototipo actual usa **datos de ejemplo en memoria** (no hay backend todavia). Al reiniciar la pagina los
datos de ejemplo vuelven a su estado inicial; la sesion se guarda solo en `sessionStorage`.

## Estructura del repositorio

```
frontend/        Aplicacion Angular + Bootstrap (prototipo)
docs/capturas/   Capturas del prototipo usadas en el informe (Cap. 2)
```

La carpeta `backend/` (Spring Boot) se agregara en las siguientes entregas.

## Tecnologias

- Angular 22 (componentes standalone, signals, Router con guards, formularios por plantilla)
- Bootstrap 5 (solo CSS, diseno responsive)
- Spring Boot, Spring Data JPA, Spring Security + JWT y Swagger (planificado para el backend)

## Como ejecutar el frontend

Requisito: Node.js `^22.22.3`, `^24.15.0` o superior (lo exige Angular 22). Verifique con `node -v`.

```bash
cd frontend
npm install
npm start
```

Abrir <http://localhost:4200>.

## Cuentas de prueba (clave: `demo123`)

| Usuario | Rol | Que puede hacer |
|---|---|---|
| `recepcion` | Administracion / recepcion | Registrar equipos, asignar tecnicos, registrar entregas |
| `tecnico1` (tambien `tecnico2`, `tecnico3`) | Tecnico | Diagnosticar, enviar presupuesto, registrar reparacion |
| `cliente1` (tambien `cliente2`) | Cliente | Ver el seguimiento de sus ordenes y aprobar o rechazar el presupuesto |

## Flujo de una orden

`Recibido` -> `En diagnostico` -> `Presupuesto enviado` -> (aprobado) `En reparacion` -> `Listo para entrega` -> `Entregado`

Si el cliente rechaza el presupuesto, la orden pasa a `Devuelto sin reparar` y se entrega el equipo sin reparar.
Regla de negocio: un mismo equipo (mismo cliente y serie) no puede tener dos ordenes abiertas a la vez.