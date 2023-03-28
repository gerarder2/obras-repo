import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sidebar-nav-link',
  template: `
    <a
      *ngIf="!isExternalLink(); else external"
      [ngClass]="hasVariant() ? 'nav-link nav-link-' + link.variant : 'nav-link'"
      routerLinkActive="active"
      [routerLink]="[link.url]"
    >
      <i *ngIf="isIcon()" class="{{ link.icon }}"></i>
      {{ link.name }}
      <span *ngIf="isBadge()" [ngClass]="'badge badge-' + link.badge.variant">{{ link.badge.text }}</span>
    </a>
    <ng-template #external>
      <a [ngClass]="hasVariant() ? 'nav-link nav-link-' + link.variant : 'nav-link'" href="{{ link.url }}">
        <i *ngIf="isIcon()" class="{{ link.icon }}"></i>
        {{ link.name }}
        <span *ngIf="isBadge()" [ngClass]="'badge badge-' + link.badge.variant">{{ link.badge.text }}</span>
      </a>
    </ng-template>
  `
})
export class AppSidebarNavLinkComponent {
  @Input() public link: any;

  constructor() {}

  public hasVariant() {
    if (this.link.variant) {
      return true;
    }
    return false;
  }

  public isBadge() {
    if (this.link.badge) {
      return true;
    }
    return false;
  }

  public isExternalLink() {
    if (this.link.url.substring(0, 4) === 'http') {
      return true;
    }
    return false;
  }

  public isIcon() {
    if (this.link.icon) {
      return true;
    }
    return false;
  }
}
