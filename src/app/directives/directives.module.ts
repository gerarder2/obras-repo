import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestringirTipoDirective, Ng2SearchPipe, DiasAMesesPipe } from './index';
import { DomChangeDirective } from './domchange-common/dom-change.directive';
import { NgxModalDraggableDirective } from './ngx-modal-draggable';

@NgModule({
  imports: [CommonModule],
  declarations: [
    RestringirTipoDirective,
    Ng2SearchPipe,
    DomChangeDirective,
    NgxModalDraggableDirective,
    DiasAMesesPipe
  ],
  exports: [RestringirTipoDirective, Ng2SearchPipe, NgxModalDraggableDirective, DiasAMesesPipe]
})
export class DirectivesModule {}
