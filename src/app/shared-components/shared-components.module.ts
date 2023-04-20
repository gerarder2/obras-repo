import { AgGridModule } from 'ag-grid-angular';
import { ButtonModule } from 'primeng/button';
import { AppModalComponent } from './app-modal/app-modal.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { DirectivesModule } from '../directives/directives.module';

@NgModule({
  imports: [
    CommonModule,
    ToolbarModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    AgGridModule,
    TableModule,
    DropdownModule,
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    DirectivesModule
  ],
  declarations: [AppModalComponent],
  exports: [AppModalComponent]
})
export class SharedComponentsModule {}
