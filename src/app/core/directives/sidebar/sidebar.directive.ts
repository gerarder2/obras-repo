import { Directive, HostListener } from '@angular/core';

/**
 * Allows the sidebar to be toggled via click.
 */
@Directive({
  selector: '[appSidebarToggler]'
})
export class SidebarToggleDirective {
  constructor() {}

  @HostListener('click', ['$event'])
  public toggleOpen($event: any) {
    $event.preventDefault();
    document.querySelector('body').classList.toggle('sidebar-hidden');
  }
}
