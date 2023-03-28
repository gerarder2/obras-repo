import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appMobileSidebarToggler]'
})
export class MobileSidebarToggleDirective {
  constructor() {}
  @HostListener('click', ['$event'])
  public toggleOpen($event: any) {
    $event.preventDefault();
    document.querySelector('body').classList.toggle('sidebar-mobile-show');
  }

  // Check if element has class
  private hasClass(target: any, elementClassName: string) {
    return new RegExp(`(\\s|^) ${elementClassName} (\\s|$)`).test(target.className);
  }
}
