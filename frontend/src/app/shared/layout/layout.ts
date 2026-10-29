import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface OpcionMenu {
  texto: string;
  ruta: string;
}

/** Estructura común de la aplicación: barra superior, menú por rol y zona de contenido. */
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
          { texto: 'Panel de órdenes', ruta: '/admin' },
          { texto: 'Recepción de equipo', ruta: '/admin/recepcion' },
        ];
      case 'TECNICO':
        return [{ texto: 'Órdenes asignadas', ruta: '/tecnico' }];
      case 'CLIENTE':
        return [{ texto: 'Mis órdenes', ruta: '/cliente' }];
      default:
        return [];
    }
  });

  readonly rolEtiqueta = computed(() => {
    switch (this.usuario()?.rol) {
      case 'ADMIN':
        return 'Administración';
      case 'TECNICO':
        return 'Técnico';
      case 'CLIENTE':
        return 'Cliente';
      default:
        return '';
    }
  });

  salir(): void {
    this.auth.cerrarSesion();
  }
}