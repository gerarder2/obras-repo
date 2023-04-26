import { AppModalComponent } from './app-modal/app-modal.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';
import { ToolbarModule } from 'primeng/toolbar';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { DirectivesModule } from '../directives/directives.module';
import { TableModule } from 'primeng/table';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    CommonModule,
    ToolbarModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    DropdownModule,
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    DirectivesModule,
    TableModule
  ],
  declarations: [AppModalComponent],
  exports: [AppModalComponent]
})
export class SharedComponentsModule {}
