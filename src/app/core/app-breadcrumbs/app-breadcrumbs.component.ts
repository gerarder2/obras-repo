import { filter } from 'rxjs/operators';
import { Component } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import { IBreadcrumb } from './breadcrumb';

@Component({
  selector: 'app-breadcrumbs',
  template: `
    <li class="breadcrumb-item">
      <a [routerLink]="'/'">Home</a>
    </li>
    <ng-template ngFor let-breadcrumb [ngForOf]="breadcrumbs" let-last="last">
      <li class="breadcrumb-item" [ngClass]="{ active: last }">
        <a *ngIf="!last" [routerLink]="breadcrumb.url">{{ breadcrumb.label.title }}</a>
        <span *ngIf="last" [routerLink]="breadcrumb.url">{{ breadcrumb.label.title }}</span>
      </li>
    </ng-template>
  `
})
export class AppBreadcrumbsComponent {
  public breadcrumbs: IBreadcrumb[];
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event) => {
      this.breadcrumbs = [];
      let currentRoute = this.activatedRoute.root;
      let theUrl = '';
      do {
        const childrenRoutes = currentRoute.children;
        currentRoute = null;
        childrenRoutes.forEach((route) => {
          if (route.outlet === 'primary') {
            const routeSnapshot = route.snapshot;
            const routeURL = routeSnapshot.url.map((segment) => segment.path).join('/');

            theUrl += `/${routeURL}`;

            if (routeURL) {
              this.breadcrumbs.push({
                label: route.snapshot.data,
                url: theUrl
              });
            }
            currentRoute = route;
          }
        });
      } while (currentRoute);
    });
  }
}
