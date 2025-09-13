import { MenuItem } from '../interfaces/menu-items';
export const MENU_ITEMS: MenuItem[] = [
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
    label: 'Configuraciones',
    icon: 'bi bi-gear',
    submenu: [
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
    ],
  },
];
