import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DatosService } from '../services/datos.service';
import { Rol } from '../models/modelos';


export const autenticado: CanActivateFn = () => {
  const auth = inject(AuthService);
  const datos = inject(DatosService);
  const router = inject(Router);
  const usuario = auth.usuario();
  if (!usuario) {
    return router.createUrlTree(['/login']);
  }
  return datos.cargarInicial(usuario.rol);
};

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