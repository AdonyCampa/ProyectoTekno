import { Component, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { OverlayscrollbarsModule } from 'overlayscrollbars-ngx';
import { MenuItem } from '../../interfaces/menu-items';
import { MENU_ITEMS } from '../../constants/menu.constants';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [OverlayscrollbarsModule, RouterLinkActive, RouterLink, NgClass],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss'],
})
export class Sidebar {
  menuItems = signal<MenuItem[]>(MENU_ITEMS);
  activeMenu = signal<string | null>(null);

  toggleMenu(label: string | undefined) {
    this.activeMenu.set(this.activeMenu() === label ? null : label ?? '');
  }
}
