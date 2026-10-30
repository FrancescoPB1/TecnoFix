import { Routes } from '@angular/router';
import { autenticado, conRol } from './guards/auth.guard';
import { Layout } from './shared/layout/layout';
import { Login } from './pages/login/login';
import { PanelAdmin } from './pages/panel-admin/panel-admin';
import { Recepcion } from './pages/recepcion/recepcion';
import { Entrega } from './pages/entrega/entrega';
import { TecnicoOrdenes } from './pages/tecnico-ordenes/tecnico-ordenes';
import { TecnicoDiagnostico } from './pages/tecnico-diagnostico/tecnico-diagnostico';
import { TecnicoReparacion } from './pages/tecnico-reparacion/tecnico-reparacion';
import { ClienteOrdenes } from './pages/cliente-ordenes/cliente-ordenes';
import { ClienteSeguimiento } from './pages/cliente-seguimiento/cliente-seguimiento';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: Login },
  {
    // Todas las pantallas internas comparten el Layout y exigen sesión iniciada.
    path: '',
    component: Layout,
    canActivate: [autenticado],
    children: [
      // Administración / recepción
      { path: 'admin', component: PanelAdmin, canActivate: [conRol], data: { rol: 'ADMIN' } },
      { path: 'admin/recepcion', component: Recepcion, canActivate: [conRol], data: { rol: 'ADMIN' } },
      { path: 'admin/entrega/:id', component: Entrega, canActivate: [conRol], data: { rol: 'ADMIN' } },
      // Técnico
      { path: 'tecnico', component: TecnicoOrdenes, canActivate: [conRol], data: { rol: 'TECNICO' } },
      { path: 'tecnico/diagnostico/:id', component: TecnicoDiagnostico, canActivate: [conRol], data: { rol: 'TECNICO' } },
      { path: 'tecnico/reparacion/:id', component: TecnicoReparacion, canActivate: [conRol], data: { rol: 'TECNICO' } },
      // Cliente
      { path: 'cliente', component: ClienteOrdenes, canActivate: [conRol], data: { rol: 'CLIENTE' } },
      { path: 'cliente/orden/:id', component: ClienteSeguimiento, canActivate: [conRol], data: { rol: 'CLIENTE' } },
    ],
  },
  { path: '**', redirectTo: 'login' },
];