import { Routes } from '@angular/router';
import { autenticado, conRol } from './guards/auth.guard';
import { Layout } from './shared/layout/layout';
import { Login } from './pages/login/login';
import { PanelAdmin } from './pages/panel-admin/panel-admin';
import { Recepcion } from './pages/recepcion/recepcion';
import { Entrega } from './pages/entrega/entrega';
import { Marcas } from './pages/marcas/marcas';
import { Usuarios } from './pages/usuarios/usuarios';
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
      // Personal del taller: el panel lo ven administrador y recepción
      { path: 'admin', component: PanelAdmin, canActivate: [conRol], data: { roles: ['ADMIN', 'RECEPCION'] } },
      // Solo recepción atiende el mostrador
      { path: 'admin/recepcion', component: Recepcion, canActivate: [conRol], data: { roles: ['RECEPCION'] } },
      { path: 'admin/entrega/:id', component: Entrega, canActivate: [conRol], data: { roles: ['RECEPCION'] } },
      // Solo el administrador gestiona usuarios y marcas
      { path: 'admin/usuarios', component: Usuarios, canActivate: [conRol], data: { roles: ['ADMIN'] } },
      { path: 'admin/marcas', component: Marcas, canActivate: [conRol], data: { roles: ['ADMIN'] } },
      // Técnico
      { path: 'tecnico', component: TecnicoOrdenes, canActivate: [conRol], data: { roles: ['TECNICO'] } },
      { path: 'tecnico/diagnostico/:id', component: TecnicoDiagnostico, canActivate: [conRol], data: { roles: ['TECNICO'] } },
      { path: 'tecnico/reparacion/:id', component: TecnicoReparacion, canActivate: [conRol], data: { roles: ['TECNICO'] } },
      // Cliente
      { path: 'cliente', component: ClienteOrdenes, canActivate: [conRol], data: { roles: ['CLIENTE'] } },
      { path: 'cliente/orden/:id', component: ClienteSeguimiento, canActivate: [conRol], data: { roles: ['CLIENTE'] } },
    ],
  },
  { path: '**', redirectTo: 'login' },
];