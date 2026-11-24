import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ETIQUETA_ROL, Rol } from '../../models/modelos';
import { MensajeFeedback } from '../../shared/mensaje-feedback/mensaje-feedback';
import { mensajeDeError } from '../../utils/errores';

interface CuentaPrueba {
  usuario: string;
  rol: Rol;
}

@Component({
  selector: 'app-login',
  imports: [FormsModule, MensajeFeedback],
  templateUrl: './login.html',
})
export class Login {
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  usuario = '';
  clave = '';
  readonly error = signal('');
  readonly entrando = signal(false);

  readonly etiquetaRol = ETIQUETA_ROL;

  readonly cuentasPrueba: CuentaPrueba[] = [
    { usuario: 'admin', rol: 'ADMIN' },
    { usuario: 'recepcion', rol: 'RECEPCION' },
    { usuario: 'tecnico1', rol: 'TECNICO' },
    { usuario: 'cliente1', rol: 'CLIENTE' },
  ];

  constructor() {
    const actual = this.auth.usuario();
    if (actual) {
      this.router.navigate([this.auth.rutaInicio(actual.rol)]);
    } else if (this.route.snapshot.queryParamMap.has('expirada')) {
      this.error.set('Su sesión venció. Ingrese nuevamente.');
    }
  }

  usarCuenta(cuenta: CuentaPrueba): void {
    this.usuario = cuenta.usuario;
    this.clave = 'demo123';
  }

  ingresar(formulario: NgForm): void {
    if (formulario.invalid || this.entrando()) {
      return;
    }
    this.error.set('');
    this.entrando.set(true);
    this.auth.iniciarSesion(this.usuario, this.clave).subscribe({
      next: (respuesta) => this.router.navigate([this.auth.rutaInicio(respuesta.usuario.rol)]),
      error: (e) => {
        this.entrando.set(false);
        this.error.set(mensajeDeError(e));
      },
    });
  }
}