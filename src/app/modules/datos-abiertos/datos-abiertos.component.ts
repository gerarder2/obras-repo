import { Component, OnInit } from '@angular/core';
import { single } from './graficas';
import { Color, id, ScaleType } from '@swimlane/ngx-charts';
import { LegendPosition } from '@swimlane/ngx-charts';
import { CatalogosService } from '../../services/catalogos.service';
import { Mensaje } from '../../models/mensaje';

@Component({
  selector: 'app-datos-abiertos',
  templateUrl: './datos-abiertos.component.html',
  styleUrls: ['./datos-abiertos.component.scss']
})
export class DatosAbiertosComponent implements OnInit {
  public cards: any[];
  public totales: any;

  single: any[];
  multi: any[];

  view: [number, number] = [400, 400];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = '';
  showYAxisLabel = true;
  yAxisLabel = '';
  legendPosition: LegendPosition;

  colorScheme: Color = {
    domain: ['#691B33', '#B18147', '#2B5C4E', '#C97B7C'],
    group: ScaleType.Ordinal,
    selectable: true,
    name: 'Customer Usage'
  };

  private mensaje: Mensaje;

  constructor(private catalogosService: CatalogosService) {
    Object.assign(this, { single });
    this.legendPosition = LegendPosition.Right;
    this.mensaje = new Mensaje();
  }

  ngOnInit(): void {
    this.cards = [
      { id: 1, cantidad: null, descripcion: 'TOTAL DE CONTRATOS', imagen: 'document_sq.png', pdf: '', cvs: '' },
      { id: 2, cantidad: null, descripcion: 'MUNICIPIOS BENEFICIADOS', imagen: 'sinaloa_map_sq.png', pdf: '', cvs: '' },
      { id: 3, cantidad: null, descripcion: 'LICITACIONES', imagen: 'books_sq.png', pdf: '', cvs: '' },
    ];
    this.loadTotales();
  }

  private loadTotales() {
    this.catalogosService.getObrasTotales({ ejercicio: 0 }).subscribe({
      next: (response: any) => {
        this.totales = response.data;
        this.cards[0].cantidad = this.totales.totalNumeroContratos;
        this.cards[1].cantidad = this.totales.totalMuncipiosBeneficiados;
        this.cards[2].cantidad = this.totales.totalLicitaciones;
      },
      error: (err: unknown) => {
        console.warn(err);
        this.mensaje.showMessage(err);
      }
    });
  }
}
