import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appRestringirTipo]'
})
export class RestringirTipoDirective {
  regexNumero = '^-?[0-9]*$';
  regexLetra = '[a-zA-ZñÑáéíóúÁÉÍÓÚs]';

  @Input() appRestringirTipo: string;

  constructor(private el: ElementRef) {}

  @HostListener('keydown', ['$event']) onKeyDown(event) {
    const e = event as KeyboardEvent;
    let regEx: RegExp;

    switch (this.appRestringirTipo) {
      case 'numero':
        regEx = new RegExp(this.regexNumero);
        break;
      case 'letras':
        regEx = new RegExp(this.regexLetra);
        break;
      default:
        return;
    }
    if ([46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1) {
      return;
    }
    const ch = e.key;
    if (regEx.test(ch)) {
      return;
    } else {
      e.preventDefault();
    }
  }
}
