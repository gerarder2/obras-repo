import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appNavDropdown]'
})
export class NavDropdownDirective {
  constructor(private el: ElementRef) {}

  public toggle() {
    this.el.nativeElement.classList.toggle('open');
  }
}
