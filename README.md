# TecnoFix - Frontend (prototipo)

Aplicación Angular 22 + Bootstrap 5. Generada con Angular CLI.

## Comandos

```bash
npm install     # instala dependencias (una sola vez)
npm start       # servidor de desarrollo en http://localhost:4200
npm run build   # compilación de producción en dist/
```

## Organización de `src/app`

| Carpeta | Contenido |
|---|---|
| `models/` | Tipos del dominio: usuario, cliente, marca, tipo de equipo, equipo, orden, estados y roles |
| `services/` | `DatosService` (datos de ejemplo en memoria) y `AuthService` (sesión simulada) |
| `guards/` | Guards de ruta: sesión iniciada y rol permitido |
| `shared/` | Layout (menú lateral por rol), badge de estado, mensaje de retroalimentación, diálogo de confirmación |
| `pages/` | Una pantalla por carpeta: login, panel-admin, recepcion, entrega, clientes, usuarios, marcas, tipos-equipo, tecnico-*, cliente-* |

## Nota

`DatosService` es temporal. Cuando exista la API REST se reemplazará por llamadas con `HttpClient`
sin cambiar las pantallas.