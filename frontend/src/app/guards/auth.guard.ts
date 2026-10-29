import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/** Exige que haya una sesión iniciada. */
export const autenticado: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.usuario() ? true : router.createUrlTree(['/login']);
};

/** Exige que el rol del usuario coincida con el rol indicado en data.rol de la ruta. */
export const conRol: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const usuario = auth.usuario();
  if (!usuario) {
    return router.createUrlTree(['/login']);
  }
  return usuario.rol === route.data['rol']
    ? true
    : router.createUrlTree([auth.rutaInicio(usuario.rol)]);
};