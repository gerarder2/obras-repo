import { Router } from '@angular/router';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sidebar-nav-item',
  template: `
    <li *ngIf="!isDropdown(); else dropdown" [ngClass]="hasClass() ? 'nav-item ' + item.class : 'nav-item'">
      <app-sidebar-nav-link [link]="item"></app-sidebar-nav-link>
    </li>
    <ng-template #dropdown>
      <li
        [ngClass]="hasClass() ? 'nav-item nav-dropdown ' + item.class : 'nav-item nav-dropdown'"
        [class.open]="isActive()"
        routerLinkActive="open"
        appNavDropdown
      >
        <app-sidebar-nav-dropdown [link]="item"></app-sidebar-nav-dropdown>
      </li>
    </ng-template>
  `
})
export class AppSidebarNavItemComponent {
  @Input() public item: any;

  constructor(private router: Router) {}

  public hasClass() {
    if (this.item.class) {
      return true;
    }
    return false;
  }

  public isDropdown() {
    if (this.item.children) {
      return true;
    }
    return false;
  }

  public thisUrl() {
    return this.item.url;
  }

  public isActive() {
    return this.router.isActive(this.thisUrl(), false);
  }
}
