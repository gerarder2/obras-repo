import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapaObrasRoutingModule } from './mapa-obras-routing.module';
import { MapaObrasComponent } from './mapa-obras.component';
import { FormsModule } from '@angular/forms';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { NgSelectModule } from '@ng-select/ng-select';
import { BlockUIModule } from 'ng-block-ui';
import { NgChartsModule } from 'ng2-charts';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { GalleriaModule } from 'primeng/galleria';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MenuModule } from 'primeng/menu';
import { OverlayModule } from 'primeng/overlay';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PanelModule } from 'primeng/panel';
import { ProgressBarModule } from 'primeng/progressbar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SidebarModule } from 'primeng/sidebar';
import { TreeSelectModule } from 'primeng/treeselect';
import { CatalogosService } from '../../services/catalogos.service';
import { CardInformationComponent } from '../dashboard/card-information/card-information.component';
import { ListaElementosComponent } from '../dashboard/lista-elementos/lista-elementos.component';
import { DashboardModule } from '../dashboard/dashboard.module';

@NgModule({
  declarations: [MapaObrasComponent],
  providers: [CatalogosService, { provide: LOCALE_ID, useValue: 'en-US' }],
  entryComponents: [CardInformationComponent],
  // exports: [CardInformationComponent, ListaElementosComponent],
  imports: [
    CommonModule,
    MapaObrasRoutingModule,
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
    GalleriaModule,
    NgScrollbarModule,
    DashboardModule
  ]
})
export class MapaObrasModule {}
