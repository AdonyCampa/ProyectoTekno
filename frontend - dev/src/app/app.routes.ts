import { Routes } from '@angular/router';
import { Layout } from './layout/layout';
import { Auth } from './pages/auth/auth';
import { Inicio } from './pages/inicio/inicio';
import { Ventas } from './pages/ventas/ventas';
import { Caja } from './pages/caja/caja';
import { Categorias } from './pages/configuraciones/categorias/categorias';
import { Inventario } from './pages/inventario/inventario';
import { Marcas } from './pages/configuraciones/marcas/marcas';
import { Roles } from './pages/roles/roles';
import { Usuarios } from './pages/usuarios/usuarios';
import { Compras } from './pages/compras/compras';
import { authenticatedGuard } from './guards/authenticated-guard';
import { authGuard } from './guards/auth-guard';
import { Medidas } from './pages/configuraciones/medidas/medidas';
import { Productos } from './pages/productos/productos';
import { Proveedores } from './pages/proveedores/proveedores';
import { Clientes } from './pages/clientes/clientes';

export const routes: Routes = [
  {
    path: 'inicio',
    component: Layout,
    canActivate: [authGuard],
    children: [
      { path: '', component: Inicio },
      { path: 'ventas', component: Ventas },
      { path: 'caja', component: Caja },
      { path: 'compras', component: Compras },
      { path: 'productos', component: Productos },
      { path: 'inventario', component: Inventario },
      { path: 'proveedores', component: Proveedores },
      { path: 'clientes', component: Clientes },
      { path: 'usuarios', component: Usuarios },
      { path: 'roles', component: Roles },
      { path: 'marcas', component: Marcas },
      { path: 'categorias', component: Categorias },
      { path: 'medidas', component: Medidas },
    ],
  },
  {
    path: 'login',
    component: Auth,
    canMatch: [authenticatedGuard],
  },
  { path: '**', redirectTo: '/login' },
];
