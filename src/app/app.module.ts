import { APP_INITIALIZER, ApplicationRef, NgModule } from '@angular/core';
// Import components
import {
  AppAsideComponent,
  AppBreadcrumbsComponent,
  AppFooterComponent,
  AppHeaderComponent,
  AppSidebarComponent,
  AppSidebarFooterComponent,
  AppSidebarFormComponent,
  AppSidebarHeaderComponent,
  AppSidebarMinimizerComponent,
  AppSidebarNavComponent,
  AppSidebarNavDropdownComponent,
  AppSidebarNavItemComponent,
  AppSidebarNavLinkComponent,
  AppSidebarNavTitleComponent
} from './core';
// Import global directives
import {
  AsideToggleDirective,
  BrandMinimizeDirective,
  MobileSidebarToggleDirective,
  NavDropdownDirective,
  NavDropdownToggleDirective,
  ReplaceDirective,
  SidebarMinimizeDirective,
  SidebarOffCanvasCloseDirective,
  SidebarToggleDirective
} from './core/directives';
import { AuthenticationService, ConfigService, MenuService } from './services/index';
import { CalendarModule, DateAdapter } from 'angular-calendar';
// Import containers
import { FullLayoutComponent, SimpleLayoutComponent } from './containers';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HashLocationStrategy, LocationStrategy, registerLocaleData } from '@angular/common';

import { AppComponent } from './app.component';
// Import routing module
import { AppRoutingModule } from './app-routing.module';
import { AuthGuard } from './guards/auth.guard';
import { BlockUIModule } from 'ng-block-ui';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { LOCALE_ID } from '@angular/core';
import { MenuModule } from 'primeng/menu';
import { NgChartsModule } from 'ng2-charts';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { Permission } from './guards/permission.guard';
import { ProgressBarModule } from 'primeng/progressbar';
import { SidebarModule } from 'primeng/sidebar';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ToasterModule } from 'angular2-toaster';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
// Import Global Services
import { fakeBackendProvider } from './helpers/fake-backend';
import localeEsMx from '@angular/common/locales/es';
import { SharedModule } from 'primeng/api';

registerLocaleData(localeEsMx);

const APP_CONTAINERS = [FullLayoutComponent, SimpleLayoutComponent];

const APP_COMPONENTS = [
  AppAsideComponent,
  AppBreadcrumbsComponent,
  AppFooterComponent,
  AppHeaderComponent,
  AppSidebarComponent,
  AppSidebarFooterComponent,
  AppSidebarFormComponent,
  AppSidebarHeaderComponent,
  AppSidebarMinimizerComponent,
  AppSidebarNavComponent,
  AppSidebarNavDropdownComponent,
  AppSidebarNavItemComponent,
  AppSidebarNavLinkComponent,
  AppSidebarNavTitleComponent
];

const APP_DIRECTIVES = [
  AsideToggleDirective,
  NavDropdownDirective,
  NavDropdownToggleDirective,
  ReplaceDirective,
  SidebarMinimizeDirective,
  SidebarOffCanvasCloseDirective,
  BrandMinimizeDirective,
  SidebarToggleDirective,
  MobileSidebarToggleDirective
];

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

export function ConfigLoader(configService: ConfigService) {
  return () => configService.getJSON();
}
@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    NgChartsModule,
    HttpClientModule,
    ToasterModule.forRoot(),
    BlockUIModule.forRoot(),
    TableModule,
    MenuModule,
    SplitButtonModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
    PerfectScrollbarModule,
    SidebarModule,
    ProgressBarModule,
    SharedModule
  ],
  declarations: [AppComponent, ...APP_CONTAINERS, ...APP_COMPONENTS, ...APP_DIRECTIVES],
  providers: [
    AuthGuard,
    Permission,
    AuthenticationService,

    fakeBackendProvider,
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    MenuService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    { provide: LOCALE_ID, useValue: 'es' },
    ConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: ConfigLoader,
      deps: [ConfigService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(public appRef: ApplicationRef) {}
  hmrOnInit(store) {
    if (!store || !store.state) {
      return;
    }
    // console.log('HMR store', store);
    // console.log('store.state.data:', store.state.data)
    // inject AppStore here and update it
    // this.AppStore.update(store.state)
    if ('restoreInputValues' in store) {
      store.restoreInputValues();
    }
    // change detection
    this.appRef.tick();
    delete store.state;
    delete store.restoreInputValues;
  }
}
