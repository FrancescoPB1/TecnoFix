import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Rol } from '../models/modelos';

/** Exige que haya una sesión iniciada. */
export const autenticado: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.usuario() ? true : router.createUrlTree(['/login']);
};

/** Exige que el rol del usuario esté entre los roles permitidos en data.roles de la ruta. */
export const conRol: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const usuario = auth.usuario();
  if (!usuario) {
    return router.createUrlTree(['/login']);
  }
  const permitidos = route.data['roles'] as Rol[];
  return permitidos.includes(usuario.rol)
    ? true
    : router.createUrlTree([auth.rutaInicio(usuario.rol)]);
};