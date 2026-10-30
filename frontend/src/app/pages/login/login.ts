import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DatosService } from '../../services/datos.service';
import { AuthService } from '../../services/auth.service';
import { ETIQUETA_ROL, Usuario } from '../../models/modelos';
import { MensajeFeedback } from '../../shared/mensaje-feedback/mensaje-feedback';

@Component({
  selector: 'app-login',
  imports: [FormsModule, MensajeFeedback],
  templateUrl: './login.html',
})
export class Login {
  private auth = inject(AuthService);
  private datos = inject(DatosService);
  private router = inject(Router);

  usuario = '';
  clave = '';
  readonly error = signal('');

  readonly etiquetaRol = ETIQUETA_ROL;

  // Cuentas de prueba que se muestran en el prototipo (una por rol).
  readonly cuentasPrueba: Usuario[] = this.datos
    .usuarios()
    .filter((u) => ['admin', 'recepcion', 'tecnico1', 'cliente1'].includes(u.usuario));

  constructor() {
    const actual = this.auth.usuario();
    if (actual) {
      this.router.navigate([this.auth.rutaInicio(actual.rol)]);
    }
  }

  usarCuenta(cuenta: Usuario): void {
    this.usuario = cuenta.usuario;
    this.clave = cuenta.clave;
  }

  ingresar(formulario: NgForm): void {
    if (formulario.invalid) {
      return;
    }
    if (this.auth.iniciarSesion(this.usuario, this.clave)) {
      const actual = this.auth.usuario()!;
      this.router.navigate([this.auth.rutaInicio(actual.rol)]);
    } else {
      this.error.set('Usuario o contraseña incorrectos.');
    }
  }
}