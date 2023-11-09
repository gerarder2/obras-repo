import { BlockUIModule } from 'ng-block-ui';
import { CardInformationComponent } from './card-information/card-information.component';
import { CatalogosService } from '../../services/catalogos.service';
import { CheckboxModule } from 'primeng/checkbox';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { GraficaPastelComponent } from './grafica-pastel/grafica-pastel.component';
import { GraficaViewComponent } from './grafica-pastel/grafica-view/grafica-view.component';
import { InputSwitchModule } from 'primeng/inputswitch';
import { LOCALE_ID } from '@angular/core';
import { MenuModule } from 'primeng/menu';
import { NgChartsModule } from 'ng2-charts';
import { NgModule } from '@angular/core';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgSelectModule } from '@ng-select/ng-select';
import { OverlayModule } from 'primeng/overlay';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PanelModule } from 'primeng/panel';
import { ProgressBarModule } from 'primeng/progressbar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SidebarModule } from 'primeng/sidebar';
import { TreeSelectModule } from 'primeng/treeselect';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ListaElementosComponent } from './lista-elementos/lista-elementos.component';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { GalleriaModule } from 'primeng/galleria';

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    NgChartsModule,
    MenuModule,
    NgSelectModule,
    NgOptionHighlightModule,
    FormsModule,
    CollapseModule,
    SidebarModule,
    CheckboxModule,
    PanelModule,
    RadioButtonModule,
    DropdownModule,
    InputSwitchModule,
    OverlayModule,
    OverlayPanelModule,
    ProgressBarModule,
    TreeSelectModule,
    NgScrollbarModule,
    ModalModule.forRoot(),
    BlockUIModule.forRoot(),
    PopoverModule.forRoot(),
    GalleriaModule
  ],
  declarations: [
    DashboardComponent,
    GraficaPastelComponent,
    GraficaViewComponent,
    CardInformationComponent,
    ListaElementosComponent
  ],
  providers: [CatalogosService, { provide: LOCALE_ID, useValue: 'en-US' }],
  entryComponents: [CardInformationComponent]
})
export class DashboardModule {}
