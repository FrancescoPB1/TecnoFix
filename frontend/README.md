# TecnoFix - Frontend (prototipo)

Aplicacion Angular 22 + Bootstrap 5. Generada con Angular CLI.

## Comandos

```bash
npm install     # instala dependencias (una sola vez)
npm start       # servidor de desarrollo en http://localhost:4200
npm run build   # compilacion de produccion en dist/
```

## Organizacion de `src/app`

| Carpeta | Contenido |
|---|---|
| `models/` | Tipos del dominio: usuario, cliente, equipo, orden, estados |
| `services/` | `DatosService` (datos de ejemplo en memoria) y `AuthService` (sesion simulada) |
| `guards/` | Guards de ruta: sesion iniciada y rol permitido |
| `shared/` | Layout (barra y menu lateral por rol), badge de estado, mensaje de retroalimentacion, dialogo de confirmacion |
| `pages/` | Una pantalla por carpeta: login, panel-admin, recepcion, entrega, tecnico-*, cliente-* |

## Nota

`DatosService` es temporal. Cuando exista la API REST se reemplazara por llamadas con `HttpClient`
sin cambiar las pantallas.