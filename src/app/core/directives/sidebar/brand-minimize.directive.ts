import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appBrandMinimizer]'
})
export class BrandMinimizeDirective {
  constructor() {}

  @HostListener('click', ['$event'])
  public toggleOpen($event: any) {
    $event.preventDefault();
    document.querySelector('body').classList.toggle('brand-minimized');
  }
}
