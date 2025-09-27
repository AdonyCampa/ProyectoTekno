import { MenuItem } from '../interfaces/menu-items';
export const MENU_ITEMS: MenuItem[] = [
  {
    label: 'MODULOS PRINCIPALES',
    isHeader: true,
  },
  {
    label: 'Inicio',
    icon: 'bi bi-house-door-fill',
    route: '/inicio',
  },
  {
    label: 'Caja',
    icon: 'bi bi-bank',
    route: '/inicio/caja',
  },
  {
    label: 'Ventas',
    icon: 'bi bi-cash-coin',
    route: '/inicio/ventas',
  },
  {
    label: 'Compras',
    icon: 'bi bi-wallet-fill',
    route: '/inicio/compras',
  },
  {
    label: 'Productos',
    icon: 'bi bi-box-seam-fill',
    route: '/inicio/productos',
  },
  {
    label: 'Proveedores',
    icon: 'bi bi-truck',
    route: '/inicio/proveedores',
  },
  {
    label: 'Clientes',
    icon: 'bi bi-person-badge',
    route: '/inicio/clientes',
  },
  {
    label: 'CONFIGURACIONES',
    isHeader: true,
  },
  {
    label: 'Autenticación',
    icon: 'bi bi-person-fill-gear',
    submenu: [
      {
        label: 'Usuarios',
        icon: 'bi bi-people-fill',
        route: '/inicio/usuarios',
      },
      {
        label: 'Roles',
        icon: 'bi bi-person-fill-lock',
        route: '/inicio/roles',
      },
    ],
  },
  {
    label: 'Mantenimientos',
    icon: 'bi bi-gear-fill',
    submenu: [
      {
        label: 'Categorias',
        icon: 'bi bi-bookmarks-fill',
        route: '/inicio/categorias',
      },
      {
        label: 'Marcas',
        icon: 'bi bi-buildings-fill',
        route: '/inicio/marcas',
      },
      {
        label: 'Medidas',
        icon: 'bi bi-tag-fill',
        route: '/inicio/medidas',
      },
    ],
  },
];
