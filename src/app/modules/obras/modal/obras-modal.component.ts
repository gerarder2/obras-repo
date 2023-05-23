import { LegendPosition } from '@swimlane/ngx-charts';
import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Mensaje } from '../../../models';
import { ObrasService } from '../services/obras.service';
import { Obra } from '../../dashboard/models/obra.interface';
import {
  ApexNonAxisChartSeries,
  ApexChart,
  ApexPlotOptions,
  ChartComponent,
  ApexStroke,
  ApexAxisChartSeries,
  ApexDataLabels,
  ApexGrid,
  ApexTitleSubtitle,
  ApexXAxis,
  ApexMarkers,
  ApexResponsive
} from 'ng-apexcharts';

export type ChartOptionsRadial = {
  colors: string[];
  series?: ApexNonAxisChartSeries;
  chart?: ApexChart;
  labels?: string[];
  plotOptions?: ApexPlotOptions;
  stroke: ApexStroke;
};

export type ChartOptionsLine = {
  colors: string[];
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  markers: ApexMarkers;
};

export type ChartOptionsPie = {
  colors: string[];
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

@Component({
  selector: 'app-obras-modal',
  templateUrl: 'obras-modal.component.html',
  styleUrls: ['../obras.component.scss']
})
export class ObrasModalComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent;

  // Variables Modal
  public cssClass: { color: string; type: string };
  public maximizado: boolean;
  public event: EventEmitter<any> = new EventEmitter();
  public isModal;
  public params: any;
  public modalExtraOptions: any;
  public titlePage = 'asdf';
  public eventos: any[];
  public value: number;
  public obra: Obra;
  // end

  //charts
  public chartOptionsRadial: Partial<ChartOptionsRadial>;
  public chartOptionsLine: Partial<ChartOptionsLine>;
  public showGraficaPorcentaje: boolean;
  public chartOptionsPie: Partial<ChartOptionsPie>;

  private mensaje: Mensaje;
  private graphicPalette: string[];

  constructor(public bsModalRef: BsModalRef, private obrasService: ObrasService) {
    this.graphicPalette = ['#952431', '#B18147', '#3D5C4F', '#6610f2'];
    this.mensaje = new Mensaje();
    this.eventos = [];
    this.value = 25;
    this.obra = {};
    this.showGraficaPorcentaje = false;
  }

  // Angular metodos del ciclo de vida del componente
  ngOnInit(): void {
    console.log(this.params);
    this.loadObraDetalle();
  }
  public loadObraDetalle() {
    this.obrasService.getObrasDatosById({ idObra: this.params.id }).subscribe({
      next: (response) => {
        console.log(response);
        this.obra = response.data;
        this.generarGraficas();
      },
      error: (err: unknown) => {
        this.mensaje.showMessage(err);
      }
    });
  }
  // ------------------------------------------------- //

  private generarGraficas() {
    // Porcentaje Avance

    const sum = this.obra.avances.reduce((accumulator, element) => {
      return accumulator + element.porcentaje;
    }, 0);

    this.showGraficaPorcentaje = true;
    this.chartOptionsRadial = {
      colors: this.graphicPalette,
      series: [Math.round(sum / 2)],
      chart: {
        height: 200,
        type: 'radialBar'
      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: '70%'
          },
          track: {
            background: '#e4e4e4'
          }
        }
      },
      stroke: {
        lineCap: 'round'
      },
      labels: ['Avance']
    };

    // Line
    this.chartOptionsLine = {
      colors: this.graphicPalette,
      series: [
        {
          name: 'Desktops',
          data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
        }
      ],
      chart: {
        height: 250,
        type: 'line',
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 2
        // colors: ['#ff0000']
      },
      title: {
        text: 'Product Trends by Month',
        align: 'left'
      },
      grid: {
        row: {
          colors: ['#d3d3d3', 'transparent'],
          opacity: 0.5
        }
      },
      markers: {
        colors: this.graphicPalette,
        size: [5]
      },
      xaxis: {
        categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep']
      }
    };

    //Pie
    this.chartOptionsPie = {
      colors: this.graphicPalette,
      series: [44, 55],
      chart: {
        width: 250,
        type: 'pie'
      },
      labels: ['Team A', 'Team B'],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom',
              show: false
            }
          }
        }
      ]
    };
  }

  // Cerrar el modal, ademas envia la informacion al componente list correspondiente. No modificar
  private closeModal(data: any) {
    const response = {
      data
    };
    this.event.next(response);
    this.bsModalRef.hide();
  }
}
