import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Rol, Usuario } from '../models/modelos';

interface RespuestaLogin {
  token: string;
  usuario: Usuario;
}

const CLAVE_SESION = 'tecnofix-sesion';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private token_: string | null = null;
  readonly usuario = signal<Usuario | null>(null);

  constructor() {
    const guardada = this.leerSesion();
    if (guardada) {
      this.token_ = guardada.token;
      this.usuario.set(guardada.usuario);
    }
  }

  token(): string | null {
    return this.token_;
  }

  iniciarSesion(usuario: string, clave: string): Observable<RespuestaLogin> {
    return this.http
      .post<RespuestaLogin>(`${environment.apiUrl}/auth/login`, { usuario: usuario.trim(), clave })
      .pipe(
        tap((respuesta) => {
          this.token_ = respuesta.token;
          this.usuario.set(respuesta.usuario);
          this.guardarSesion(respuesta);
        }),
      );
  }

  cerrarSesion(expirada = false): void {
    this.token_ = null;
    this.usuario.set(null);
    try {
      sessionStorage.removeItem(CLAVE_SESION);
    } catch {
      
    }
    this.router.navigate(['/login'], { queryParams: expirada ? { expirada: 1 } : {} });
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

  private guardarSesion(respuesta: RespuestaLogin): void {
    try {
      sessionStorage.setItem(CLAVE_SESION, JSON.stringify(respuesta));
    } catch {

    }
  }

  private leerSesion(): RespuestaLogin | null {
    try {
      const texto = sessionStorage.getItem(CLAVE_SESION);
      return texto ? (JSON.parse(texto) as RespuestaLogin) : null;
    } catch {
      return null;
    }
  }
}