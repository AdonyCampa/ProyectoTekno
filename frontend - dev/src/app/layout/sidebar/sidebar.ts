import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { OverlayscrollbarsModule } from 'overlayscrollbars-ngx';
import { MenuItem } from '../../interfaces/menu-items';
import { MENU_ITEMS } from '../../constants/menu.constants';
import { NgClass } from '@angular/common';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  imports: [OverlayscrollbarsModule, RouterLinkActive, RouterLink, NgClass],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss'],
})
export class Sidebar implements OnInit, OnDestroy {
  [x: string]: any;
  router = inject(Router);

  menuItems = signal<MenuItem[]>(MENU_ITEMS);
  activeMenu = signal<string | null>(null);

  currentUrl = '';
  subscription!: Subscription;

  ngOnInit(): void {
    // Escuchar cambios de navegación
    this.subscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentUrl = event.urlAfterRedirects;
        this.updateActiveMenu();
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  toggleMenu(label: string | undefined) {
    this.activeMenu.set(this.activeMenu() === label ? null : label ?? '');
  }

  updateActiveMenu() {
    // Revisa si algún ítem tiene la ruta actual
    const found = this.menuItems().find(
      (item) =>
        item.route === this.currentUrl ||
        (item.submenu && item.submenu.some((sub) => sub.route === this.currentUrl))
    );

    if (found) {
      this.activeMenu.set(found.label);
    } else {
      this.activeMenu.set(null);
    }
  }
}
