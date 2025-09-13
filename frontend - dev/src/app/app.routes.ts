import { Routes } from '@angular/router';
import { Layout } from './layout/layout';
import { Auth } from './pages/auth/auth';
import { Inicio } from './pages/inicio/inicio';
import { Ventas } from './pages/ventas/ventas';
import { Caja } from './pages/caja/caja';
import { Categorias } from './pages/categorias/categorias';
import { Inventario } from './pages/inventario/inventario';
import { Marcas } from './pages/marcas/marcas';
import { Roles } from './pages/roles/roles';
import { Usuarios } from './pages/usuarios/usuarios';
import { Compras } from './pages/compras/compras';
import { authenticatedGuard } from './guards/authenticated-guard';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: 'inicio',
    component: Layout,
    //canActivate: [authGuard],
    children: [
      { path: '', component: Inicio },
      { path: 'ventas', component: Ventas },
      { path: 'caja', component: Caja },
      { path: 'compras', component: Compras },
      { path: 'categorias', component: Categorias },
      { path: 'inventario', component: Inventario },
      { path: 'marcas', component: Marcas },
      { path: 'roles', component: Roles },
      { path: 'usuarios', component: Usuarios },
    ],
  },
  {
    path: 'login',
    component: Auth,
    //canMatch: [authenticatedGuard]
  },
  { path: '**', redirectTo: '/login' },
];
