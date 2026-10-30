import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Rol, Usuario } from '../models/modelos';
import { DatosService } from './datos.service';

/**
 * Autenticación simulada del prototipo.
 * Verifica usuario y clave contra los datos de ejemplo. En el Capítulo 6 se
 * reemplazará por el inicio de sesión contra la API con Spring Security y JWT.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private datos = inject(DatosService);
  private router = inject(Router);

  readonly usuario = signal<Usuario | null>(this.leerSesion());

  iniciarSesion(usuario: string, clave: string): boolean {
    const encontrado = this.datos
      .usuarios()
      .find((u) => u.usuario === usuario.trim() && u.clave === clave && u.activo);
    if (!encontrado) {
      return false;
    }
    this.usuario.set(encontrado);
    try {
      sessionStorage.setItem('tecnofix-usuario', String(encontrado.id));
    } catch {
      // Si el navegador bloquea el almacenamiento, la sesión dura solo mientras esté abierta la página.
    }
    return true;
  }

  cerrarSesion(): void {
    this.usuario.set(null);
    try {
      sessionStorage.removeItem('tecnofix-usuario');
    } catch {
      // Sin acción.
    }
    this.router.navigate(['/login']);
  }

  rutaInicio(rol: Rol): string {
    switch (rol) {
      case 'ADMIN':
      case 'RECEPCION':
        return '/admin';
      case 'TECNICO':
        return '/tecnico';
      default:
        return '/cliente';
    }
  }

  private leerSesion(): Usuario | null {
    try {
      const id = Number(sessionStorage.getItem('tecnofix-usuario'));
      return this.datos.usuarios().find((u) => u.id === id) ?? null;
    } catch {
      return null;
    }
  }
}