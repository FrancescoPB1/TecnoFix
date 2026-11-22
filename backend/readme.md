# TecnoFix - Backend (API REST)

API REST de TecnoFix hecha con **Spring Boot 3**, **JPA / Hibernate** y **SQL Server**. Atiende al frontend Angular de la carpeta `../frontend`. Caso de estudio: red de sedes de servicio técnico (referencia: Samsung Perú). Todos los datos de ejemplo son ficticios.

## Requisitos

- JDK 17 o superior (`java -version`).
- SQL Server (Express o Developer) con una base de datos llamada `tecnofix`. Si no quieres instalarlo, usa el perfil `h2` (base de datos en memoria).
- No hace falta instalar Maven: el proyecto incluye el Maven Wrapper (`mvnw`).

## Cómo levantar el backend

**Con SQL Server** (después de crear la base y el usuario, ver abajo):

```
cd backend
./mvnw spring-boot:run
```

En PowerShell: `.\mvnw spring-boot:run`

**Sin SQL Server (base en memoria H2)**:

```
./mvnw spring-boot:run "-Dspring-boot.run.profiles=h2"
```

Las comillas son obligatorias en PowerShell; en Git Bash tambien funcionan.

El backend queda en `http://localhost:8080`. Al arrancar con la base vacía se cargan sedes, personal, clientes, equipos y órdenes de ejemplo. Todas las cuentas tienen la clave `demo123`: `admin`, `recepcion` (Lima Centro), `recepcion2` (Lima Norte), `recepcion3` (Trujillo), `tecnico1` y `tecnico2` (Lima Centro), `tecnico3` (Trujillo), `tecnico4` (Lima Norte), `cliente1` y `cliente2`.

### Preparar SQL Server (una sola vez)

En SQL Server Management Studio (o `sqlcmd`) ejecuta:

```sql
CREATE DATABASE tecnofix;
GO
CREATE LOGIN tecnofix WITH PASSWORD = 'Tecnofix2026', CHECK_POLICY = OFF;
GO
USE tecnofix;
CREATE USER tecnofix FOR LOGIN tecnofix;
ALTER ROLE db_owner ADD MEMBER tecnofix;
GO
```

El servidor debe permitir autenticación de SQL Server (modo mixto) y conexiones TCP/IP por el puerto 1433. Los valores se pueden cambiar con variables de entorno: `DB_URL`, `DB_USUARIO`, `DB_CLAVE`, `JWT_SECRETO` y `CORS_ORIGENES` (ver `src/main/resources/application.properties`).

## Estructura (capas)

| Carpeta (`src/main/java/pe/tecnofix/backend`) | Qué contiene |
|---|---|
| `modelo` | Entidades JPA (Sede, Usuario, Cliente, TipoEquipo, Equipo, Orden, MovimientoOrden) y enums (Rol, EstadoOrden, Decision) |
| `datos` | Repositorios Spring Data (consultas a la base) y el cargador de datos de ejemplo |
| `negocio` | Servicios con las reglas del negocio, excepciones, `Solicitudes` (datos de entrada con validaciones) y `Respuestas` |
| `presentacion` | Controladores REST y el manejador de errores |
| `seguridad` | Token JWT, filtro de autenticación por rol y configuración (CORS y cifrado de claves) |

## Seguridad

- El login (`POST /api/auth/login`) devuelve un token JWT que vence a las 8 horas. Las demás peticiones llevan el encabezado `Authorization: Bearer <token>`.
- Las claves se guardan cifradas con BCrypt.
- Cada endpoint declara los roles permitidos; recepción solo opera sobre su sede, el técnico sobre sus órdenes y el cliente sobre las suyas.

## Endpoints

Los errores responden JSON con la forma `{ "estado": 409, "error": "Conflict", "mensaje": "...", "detalles": { "campo": "mensaje" } }`.

| Método | Ruta | Roles | Códigos |
|---|---|---|---|
| POST | `/api/auth/login` | Público | 200, 400, 401, 403 |
| GET | `/api/auth/yo` | Con sesión | 200, 401 |
| GET | `/api/sedes` | Con sesión | 200 |
| GET | `/api/sedes/{id}` | Con sesión | 200, 404 |
| POST | `/api/sedes` | Administrador | 201, 400, 409 |
| PUT | `/api/sedes/{id}` | Administrador | 200, 400, 404, 409 |
| PATCH | `/api/sedes/{id}/estado` | Administrador | 200, 404, 409 |
| GET | `/api/tipos-equipo` | Con sesión | 200 |
| POST | `/api/tipos-equipo` | Administrador | 201, 400, 409 |
| DELETE | `/api/tipos-equipo/{id}` | Administrador | 204, 404, 409 |
| GET | `/api/usuarios` | Administrador | 200 |
| GET | `/api/usuarios/tecnicos?sedeId=` | Administrador, Recepción | 200 |
| POST | `/api/usuarios` | Administrador | 201, 400, 409 |
| PUT | `/api/usuarios/{id}` | Administrador | 200, 400, 404, 409 |
| PATCH | `/api/usuarios/{id}/estado` | Administrador | 200, 404 |
| GET | `/api/clientes` | Administrador, Recepción | 200 |
| GET | `/api/clientes/{id}` | Administrador, Recepción | 200, 404 |
| GET | `/api/clientes/dni/{dni}` | Administrador, Recepción | 200, 404 |
| POST | `/api/clientes` | Administrador, Recepción | 201, 400, 409 |
| PUT | `/api/clientes/{id}` | Administrador, Recepción | 200, 400, 404 |
| POST | `/api/clientes/{id}/restablecer-clave` | Administrador, Recepción | 200, 404 |
| GET | `/api/ordenes?sedeId=` | Con sesión (cada rol ve lo suyo) | 200 |
| GET | `/api/ordenes/{id}` | Con sesión (si tiene acceso) | 200, 403, 404 |
| POST | `/api/ordenes/recepcion` | Recepción | 201, 400, 409 |
| PATCH | `/api/ordenes/{id}/asignacion` | Administrador, Recepción | 200, 400, 403, 404, 409 |
| PATCH | `/api/ordenes/{id}/diagnostico` | Técnico | 200, 400, 403, 404, 409 |
| PATCH | `/api/ordenes/{id}/decision` | Cliente | 200, 400, 403, 404, 409 |
| PATCH | `/api/ordenes/{id}/reparacion` | Técnico | 200, 400, 403, 404, 409 |
| PATCH | `/api/ordenes/{id}/entrega` | Recepción | 200, 400, 403, 404, 409 |

## Pruebas con Postman

1. Con el backend levantado, abre Postman y usa **Import** con el archivo `postman/TecnoFix.postman_collection.json`.
2. Abre la colección **TecnoFix API** y usa **Run** (Collection Runner) con todas las carpetas, en orden.
3. Cada solicitud tiene pruebas que revisan el código de respuesta y el contenido; la colección guarda sola los tokens y los ids que necesita.

También hay una prueba automática de arranque (`./mvnw test`) que levanta toda la aplicación con la base H2.