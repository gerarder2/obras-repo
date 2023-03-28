// Import navigation elements
import { AuthenticationService, MenuService } from './../../services/index';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { Component } from '@angular/core';
import { Mensaje } from './../../models/mensaje';
import { ToasterService } from 'angular2-toaster';

@Component({
  selector: 'app-sidebar-nav',
  template: `
    <nav class="sidebar-nav" *blockUI="'menu-data'">
      <ul class="nav">
        <ng-template ngFor let-navitem [ngForOf]="navigation">
          <li *ngIf="isDivider(navitem)" class="nav-divider"></li>
          <ng-template [ngIf]="isTitle(navitem)">
            <app-sidebar-nav-title [title]="navitem"></app-sidebar-nav-title>
          </ng-template>
          <ng-template [ngIf]="!isDivider(navitem) && !isTitle(navitem)">
            <app-sidebar-nav-item [item]="navitem"></app-sidebar-nav-item>
          </ng-template>
        </ng-template>
      </ul>
    </nav>
  `
})
export class AppSidebarNavComponent {
  @BlockUI('menu-data')
  public blockUI: NgBlockUI;
  // public navigation = navigation;
  public navigation;
  public mensaje: Mensaje;
  public user: any;

  constructor(private menuData: MenuService, private auth: AuthenticationService) {
    this.mensaje = new Mensaje();
    this.user = this.auth.currentUser();
    this.loadMenu();
  }

  public isDivider(item) {
    if (item.divider) {
      return true;
    }
    return false;
  }
  public isTitle(item) {
    if (item.title) {
      return true;
    }
    return false;
  }

  public loadMenu() {
    this.blockUI.start('Loading...');
    this.menuData.getMenu().subscribe(
      (result) => {
        this.navigation = result;
        this.blockUI.stop();
        if (this.navigation.length > 0) {
          this.menuData.setExistMenu(true);
          document.querySelector('body').classList.remove('sidebar-hidden');
        }
      },
      (error: unknown) => {
        this.mensaje.messageError(error['data']['userMessage']);
      }
    );
  }
}
