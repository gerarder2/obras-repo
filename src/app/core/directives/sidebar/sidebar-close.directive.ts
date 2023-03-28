import { Directive, HostListener } from '@angular/core';

/**
 * Allows the off-canvas sidebar to be closed via click.
 */
@Directive({
  selector: '[appSidebarClose]'
})
export class SidebarOffCanvasCloseDirective {
  constructor() {}

  @HostListener('click', ['$event'])
  public toggleOpen($event: any) {
    $event.preventDefault();

    if (this.hasClass(document.querySelector('body'), 'sidebar-off-canvas')) {
      this.toggleClass(document.querySelector('body'), 'sidebar-opened');
    }
  }
  // Check if element has class
  private hasClass(target: any, elementClassName: string) {
    return new RegExp(`(\\s|^) ${elementClassName} (\\s|$)`).test(target.className);
  }

  // Toggle element class
  private toggleClass(elem: any, elementClassName: string) {
    let newClass = `${elem.className.replace(/[\t\r\n]/g, ' ')} `;
    if (this.hasClass(elem, elementClassName)) {
      while (newClass.indexOf(` ${elementClassName} `) >= 0) {
        newClass = newClass.replace(` ${elementClassName} `, ' ');
      }
      elem.className = newClass.replace(/^\s+|\s+$/g, '');
    } else {
      elem.className += ' ' + elementClassName;
    }
  }
}
