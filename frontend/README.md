# TecnoFix - Frontend

Aplicación web en **Angular** para la gestión de órdenes de servicio técnico de una red de sedes.
Se conecta a la API REST de TecnoFix (Spring Boot, carpeta `backend/` del repositorio) y usa datos
de ejemplo; no incluye información real de ninguna empresa.

Proyecto del curso **Soluciones Web y Aplicaciones Distribuidas (SIST1402A)**, UPN.

## Tecnologías

- Angular (componentes standalone y signals), TypeScript
- Bootstrap 5 y Bootstrap Icons
- `HttpClient` con interceptores funcionales (token JWT e indicador de carga)

## Cómo ejecutarlo

1. Levante la API (carpeta `backend/`). Con la base de datos de pruebas en memoria:

   ```bash
   ./mvnw spring-boot:run "-Dspring-boot.run.profiles=h2"
   ```

   Con SQL Server, siga las instrucciones de `backend/README.md`.

2. En otra terminal, desde la carpeta `frontend/`:

   ```bash
   npm install
   ng serve
   ```

3. Abra `http://localhost:4200/`.

La dirección de la API está en `src/environments/environment.ts` (`http://localhost:8080/api`).
Para la compilación de producción (`ng build`) se usa `src/environments/environment.production.ts`.

## Cuentas de prueba

La API crea estas cuentas al iniciar con la base vacía. Todas usan la clave `demo123`.

| Rol | Usuario |
| --- | --- |
| Administrador | admin |
| Recepción (Lima Centro) | recepcion |
| Técnico | tecnico1 |
| Cliente | cliente1 |

## Estructura de `src/app`

| Carpeta | Contenido |
| --- | --- |
| `pages/` | Una pantalla por componente (login, panel de órdenes, detalle de la orden, recepción, entrega, clientes, usuarios, sedes, tipos, técnico y cliente) |
| `shared/` | Componentes reutilizables (layout, mensajes, diálogo de confirmación, estado de la orden, lista de avances de reparación) |
| `services/` | `AuthService` (inicio de sesión y token), `DatosService` (datos y operaciones contra la API) y `CargaService` |
| `interceptors/` | `jwt.interceptor` (agrega el token y cierra la sesión si vence) y `carga.interceptor` |
| `guards/` | Guards de rutas por sesión y por rol |
| `models/` | Interfaces que corresponden al JSON de la API |
| `utils/` | Conversión de errores HTTP a mensajes para el usuario |

## Cómo funciona la integración

- Al iniciar sesión, la API entrega un token JWT que se guarda en `sessionStorage`.
- El interceptor agrega `Authorization: Bearer <token>` a cada petición hacia la API.
- Antes de mostrar cualquier pantalla, el guard carga los datos que necesita el rol
  (el cliente solo recibe sus órdenes, el técnico las asignadas y recepción las de su sede).
- Cada operación que modifica datos llama a la API y, si responde bien, actualiza los signals
  con lo que devolvió el servidor. Si responde con error, la pantalla muestra el mensaje de la API.
- Si la API responde 401 (token vencido), se cierra la sesión y se vuelve al login.

## Seguimiento de la reparación

- Cada vez que el técnico presiona **Guardar avance**, la API agrega un registro (actividad, repuestos, pruebas, fecha y técnico)
  al historial de avances de la orden y los campos del formulario se limpian.
- El administrador y recepción abren **Ver detalle** desde el panel para revisar todo lo registrado; el cliente ve los mismos
  avances en su pantalla de seguimiento.
- Los accesorios se registran uno por uno en la recepción. En la entrega la lista no se puede modificar: solo se marca
  cuáles se devuelven y, si alguno queda sin devolver, es obligatorio explicar el motivo en las observaciones.
- En la entrega, la casilla **Lo recibe el mismo titular** completa el receptor con el nombre del cliente.

## Comandos útiles

```bash
ng serve          # desarrollo en http://localhost:4200
ng build          # compilación de producción en dist/
```