import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss']
})
export class Sidebar {

  constructor(private router: Router,
    private authService: AuthService) { }

  logout() {
    this.router.navigateByUrl('/login');
  }

  navInicio() {
    this.router.navigateByUrl('/inicio');
  }
  navVentas() {
    this.router.navigateByUrl('/inicio/ventas');
  }
  navCaja() {
    this.router.navigateByUrl('/inicio/caja');
  }
  navInventario() {
    this.router.navigateByUrl('/inicio/inventario');
  }
  navCompras() {
    this.router.navigateByUrl('/inicio/compras');
  }
  navUsuarios() {
    this.router.navigateByUrl('/inicio/usuarios');
  }

}
