import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ETIQUETA_ROL } from '../../models/modelos';

interface OpcionMenu {
  texto: string;
  ruta: string;
  icono: string;
}

/** Estructura común de la aplicación: menú lateral según el rol y zona de contenido. */
@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.html',
})
export class Layout {
  private auth = inject(AuthService);

  readonly usuario = this.auth.usuario;

  readonly opciones = computed<OpcionMenu[]>(() => {
    switch (this.usuario()?.rol) {
      case 'ADMIN':
        return [
          { texto: 'Panel de órdenes', ruta: '/admin', icono: 'bi-speedometer2' },
          { texto: 'Usuarios', ruta: '/admin/usuarios', icono: 'bi-people' },
          { texto: 'Marcas', ruta: '/admin/marcas', icono: 'bi-tags' },
        ];
      case 'RECEPCION':
        return [
          { texto: 'Panel de órdenes', ruta: '/admin', icono: 'bi-speedometer2' },
          { texto: 'Recepción de equipo', ruta: '/admin/recepcion', icono: 'bi-box-arrow-in-down' },
        ];
      case 'TECNICO':
        return [{ texto: 'Órdenes asignadas', ruta: '/tecnico', icono: 'bi-tools' }];
      case 'CLIENTE':
        return [{ texto: 'Mis órdenes', ruta: '/cliente', icono: 'bi-clipboard-check' }];
      default:
        return [];
    }
  });

  readonly rolEtiqueta = computed(() => {
    const rol = this.usuario()?.rol;
    return rol ? ETIQUETA_ROL[rol] : '';
  });

  readonly inicial = computed(() => (this.usuario()?.nombre ?? '?').charAt(0).toUpperCase());

  salir(): void {
    this.auth.cerrarSesion();
  }
}