import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CaminosRoutingModule } from './caminos-routing.module';
import { CaminosComponent } from './caminos.component';
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

@NgModule({
  declarations: [CaminosComponent],
  imports: [
    CommonModule,
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
    CaminosRoutingModule
  ]
})
export class CaminosModule {}
