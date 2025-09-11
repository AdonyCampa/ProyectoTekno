import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Route, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.checkStatus().pipe(
    map(isAuth => {
      if (isAuth) {
        return true; // ✅ usuario logueado
      } else {
        router.navigate(['/login']); // 🔒 redirigir si no está logueado
        return false;
      }
    })
  );
};
