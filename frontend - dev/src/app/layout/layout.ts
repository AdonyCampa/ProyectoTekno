import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Topbar } from './topbar/topbar';
import { Sidebar } from './sidebar/sidebar';
import { Inicio } from '../pages/inicio/inicio';
import { Footer } from './footer/footer';

@Component({
  selector: 'app-layout',
  imports: [RouterModule, Topbar, Sidebar, Footer],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {
  authService = inject(AuthService);
}
