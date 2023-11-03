import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-lista-elementos',
  templateUrl: './lista-elementos.component.html',
  styleUrls: ['./lista-elementos.component.scss']
})
export class ListaElementosComponent {
  @Input() titulo: string;
  @Input() elementoActivo?: boolean;
  @Input() totales?: number;
  @Input() currency?: boolean = false;
  @Input() active?: boolean = false;
  @Input() enableToggle?: boolean = true;

  toggleActive() {
    if (this.enableToggle) {
      this.elementoActivo = !this.elementoActivo;
    }
  }
}
