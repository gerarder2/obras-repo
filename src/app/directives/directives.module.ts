import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestringirTipoDirective, Ng2SearchPipe } from './index';
import { DomChangeDirective } from './domchange-common/dom-change.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [RestringirTipoDirective, Ng2SearchPipe, DomChangeDirective],
  exports: [RestringirTipoDirective, Ng2SearchPipe]
})
export class DirectivesModule {}
