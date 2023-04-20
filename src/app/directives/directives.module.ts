import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestringirTipoDirective, Ng2SearchPipe } from './index';
import { DomChangeDirective } from './domchange-common/dom-change.directive';
import { NgxModalDraggableDirective } from './ngx-modal-draggable';

@NgModule({
  imports: [CommonModule],
  declarations: [RestringirTipoDirective, Ng2SearchPipe, DomChangeDirective, NgxModalDraggableDirective],
  exports: [RestringirTipoDirective, Ng2SearchPipe, NgxModalDraggableDirective]
})
export class DirectivesModule {}
