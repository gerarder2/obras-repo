import { Component, OnInit } from '@angular/core';
import { single } from './graficas';
import { Color, ScaleType } from '@swimlane/ngx-charts';
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
      { id: 1, cantidad: 1069, descripcion: 'TOTAL DE CONTRATOS', imagen: 'document_sq.png', pdf: '', cvs: '' },
      { id: 2, cantidad: 516, descripcion: 'CONTRATISTAS', imagen: 'contratista_sq.png', pdf: '', cvs: '' },
      { id: 3, cantidad: 18, descripcion: 'MUNICIPIOS BENEFICIADOS', imagen: 'sinaloa_map_sq.png', pdf: '', cvs: '' },
      { id: 4, cantidad: 35, descripcion: 'DEPENDENCIAS / ORGANISMOS', imagen: 'building_sq.png', pdf: '', cvs: '' },
      {
        id: 5,
        cantidad: 2929438639.42,
        descripcion: 'MONTO TOTAL EJERCIDO',
        imagen: 'dollar_sq.png',
        pdf: '',
        cvs: ''
      },
      { id: 6, cantidad: 862, descripcion: 'LICITACIONES', imagen: 'books_sq.png', pdf: '', cvs: '' },
      { id: 7, cantidad: 1903, descripcion: 'EVENTOS DE LICITACION', imagen: 'calendar_sq.png', pdf: '', cvs: '' }
    ];
    this.loadTotales();
  }

  private loadTotales() {
    this.catalogosService.getObrasTotales({ ejercicio: 0 }).subscribe({
      next: (response: any) => {
        this.totales = response.data[0];
        this.cards = [
          {
            id: 1,
            cantidad: this.totales.totalNumeroContratos,
            descripcion: 'TOTAL DE CONTRATOS',
            imagen: 'contrato-icon.svg'
          },
          {
            id: 2,
            cantidad: this.totales.totalContratistas,
            descripcion: 'CONTRATISTAS',
            imagen: 'contratistas-icon.svg'
          },
          {
            id: 3,
            cantidad: this.totales.totalMuncipiosBeneficiados,
            descripcion: 'MUNICIPIOS BENEFICIADOS',
            imagen: 'municipios-icon.svg'
          },
          {
            id: 4,
            cantidad: this.totales.totalDependencias,
            descripcion: 'DEPENDENCIAS / ORGANISMOS',
            imagen: 'depend-org-icon.svg'
          },
          {
            id: 5,
            cantidad: this.totales.totalConveniosModificatorios,
            descripcion: 'CONVENIOS MODIFICATORIOS',
            imagen: 'convenios-icon.svg'
          },
          {
            id: 6,
            cantidad: this.totales.totalLicitaciones,
            descripcion: 'LICITACIONES',
            imagen: 'licitaciones-icon.svg'
          },
          {
            id: 7,
            cantidad: this.totales.totalEventosLicitaciones,
            descripcion: 'EVENTOS DE LICITACION',
            imagen: 'evlicitacion-icon.svg'
          }
        ];
      },
      error: (err: unknown) => {
        console.warn(err);
        this.mensaje.showMessage(err);
      }
    });
  }
}
