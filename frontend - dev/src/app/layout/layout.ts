import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { JsonPipe } from '@angular/common';
import { Sidebar } from './sidebar/sidebar';
import { Topbar } from './topbar/topbar';

@Component({
  selector: 'app-layout',
  imports: [JsonPipe, RouterModule],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout implements OnInit {

  get usuario() {
    return this.authService.usuario;
  }

  constructor(private router: Router,
    private authService: AuthService) { }

  ngOnInit(): void {

  }

  logout() {
    this.router.navigateByUrl('/login');
    this.authService.logout();
  }

}