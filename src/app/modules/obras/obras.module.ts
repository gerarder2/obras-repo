import { CommonModule } from '@angular/common';
import { ObrasRoutingModule } from './obras-routing.module';
import { ObrasComponent } from './obras.component';
import { ObrasModalComponent } from './modal/obras-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { DirectivesModule } from '../../directives/directives.module';
import { TabViewModule } from 'primeng/tabview';
import { SelectButtonModule } from 'primeng/selectbutton';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { GalleriaModule } from 'primeng/galleria';

import { LOCALE_ID, NgModule } from '@angular/core';
import { BlockUIModule } from 'ng-block-ui';
import { ModalPorMunicipioComponent } from './modal-por-municipio/modal-por-municipio.component';
import { ModalFichaTecnicaComponent } from './modal-ficha-tecnica/modal-ficha-tecnica.component';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  declarations: [ObrasComponent, ObrasModalComponent, ModalPorMunicipioComponent, ModalFichaTecnicaComponent],
  imports: [
    CommonModule,
    ObrasRoutingModule,
    ProgressBarModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    CollapseModule.forRoot(),
    TableModule,
    DirectivesModule,
    ModalModule.forRoot(),
    TabViewModule,
    SelectButtonModule,
    BlockUIModule.forRoot(),
    NgApexchartsModule,
    CarouselModule.forRoot(),
    GalleriaModule,
    TooltipModule
  ],
  exports: [ObrasModalComponent],
  providers: [{ provide: LOCALE_ID, useValue: 'en-US' }]
})
export class ObrasModule {}
