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
import { Evidencia } from '../../dashboard/models/evidencia.interface';
import { Imagen } from '../../dashboard/models/imagen.interface';
import * as moment from 'moment';
import { Avance } from '../../dashboard/models/avance.interface';
import { UltimaEvidencia } from '../../dashboard/models/ultimaEvidencia.interface';
import { HelperService } from '../../../helpers/helper.service';

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
  public obra: Obra;
  public evidencia: Evidencia;
  public obraAvancesSorter: Avance[];
  // end

  //charts
  public chartOptionsRadial: Partial<ChartOptionsRadial>;
  public chartOptionsLine: Partial<ChartOptionsLine>;
  public showGraficaPorcentaje: boolean;
  public chartOptionsPie: Partial<ChartOptionsPie>;
  public showCharts: boolean;

  //Layout
  public showCarousel: boolean;
  public imageIndex: number;

  //Gallery
  public responsiveOptions: any[];
  public displayCustom: boolean;
  public activeIndex: number;
  public images: any[];

  private mensaje: Mensaje;
  private graphicPalette: string[];
  public esPreecasin = false;

  constructor(
    public bsObraModalRef: BsModalRef,
    private obrasService: ObrasService,
    private helperService: HelperService
  ) {
    this.showCharts = false;
    this.graphicPalette = ['#952431', '#B18147', '#3D5C4F', '#6610f2'];
    this.mensaje = new Mensaje();
    this.eventos = [];
    this.obra = {};
    this.showGraficaPorcentaje = false;
    this.showCarousel = false;
    this.imageIndex = 0;
    this.activeIndex = 0;
    this.displayCustom = false;
    this.images = [];

    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 5
      },
      {
        breakpoint: '768px',
        numVisible: 3
      },
      {
        breakpoint: '560px',
        numVisible: 1
      }
    ];
  }

  // Angular metodos del ciclo de vida del componente
  ngOnInit(): void {
    this.loadObraDetalle();
  }
  public loadObraDetalle() {
    this.obrasService.getObrasDatosById({ idObra: this.params.id }).subscribe({
      next: (response) => {
        this.obra = response.data;
        this.esPreecasin = this.obra.idDependencia === 119;
        if (this.obra.licitacion) {
          this.params.licitacion = this.obra.licitacion;
        }

        this.generarGraficas();
      },
      error: (err: unknown) => {
        this.mensaje.showMessage(err);
      }
    });
  }

  public onImageSelected(evidencia: Evidencia, index, ultimasImagenes?: UltimaEvidencia[]) {
    this.evidencia = evidencia;
    this.images = this.formatImages(ultimasImagenes ? ultimasImagenes : evidencia.imagenes);
    // this.showCarousel = true;
    this.imageIndex = index;
    this.activeIndex = index;
    this.displayCustom = true;
  }
  // ------------------------------------------------- //

  private formatImages(images: Imagen[]) {
    const imgs = [];
    images.forEach((element, index) => {
      imgs.push({
        previewImageSrc: `${element.rutaPublica}${element.nombre}`,
        thumbnailImageSrc: `${element.rutaPublica}${element.nombre}`,
        alt: '',
        title: `Imagen - ${index + 1}`
      });
    });
    return imgs;
  }

  private generarGraficas() {
    // Porcentaje Avance
    const seriesPie = [];
    const seriesPieLabel = [];

    const categories = [];
    const data = [];

    this.obraAvancesSorter = [...this.obra.avances];

    this.obraAvancesSorter.sort((a, b) => {
      return new Date(b.fecha).getTime() - new Date(a.fecha).getTime() || b.id - a.id;
    });

    const porcentaje = this.obra.avances.reduce((accumulator, element) => {
      return accumulator + element.porcentaje;
    }, 0);

    this.obra?.avances?.forEach((element) => {
      seriesPie.push(element.porcentaje);
      seriesPieLabel.push(`${moment(element.fecha).format('DD/MMM/YYYY')}`);

      const fecha = moment(element.fecha).format('DD/MMMM/YYYY');
      categories.push(fecha.toString());
      data.push(element.porcentaje);
    });

    this.showGraficaPorcentaje = true;
    this.chartOptionsRadial = {
      colors: this.graphicPalette,
      series: [this.obra.avances.length > 0 ? this.obra.avances[this.obra.avances.length - 1].porcentaje : 0],
      chart: {
        height: 210,
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
      labels: ['Avance de Obra']
    };

    // Line
    this.chartOptionsLine = {
      colors: this.graphicPalette,
      series: [
        {
          name: '% Avance',
          data: data ? data : [0]
        }
      ],
      chart: {
        height: 180,
        type: 'line',
        zoom: {
          enabled: false
        },
        fontFamily: 'Montserrat'
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
        text: 'Avances de la Obra',
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
        categories: categories
      }
    };

    //Pie
    this.chartOptionsPie = {
      colors: this.graphicPalette,
      series: seriesPie,
      chart: {
        width: 300,
        type: 'pie'
      },
      labels: seriesPieLabel,
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
    this.showCharts = true;
  }

  // Cerrar el modal, ademas envia la informacion al componente list correspondiente. No modificar
  public closeModal(data?: any) {
    const response = {
      data
    };
    this.event.next(response);
    this.helperService.setClosePopup('closeObraModal', this.obra);
    this.bsObraModalRef.hide();
  }

  // openGoogleMaps(): string {
  //   let url = '';
  //   url = `https://www.google.com/maps?q=${this.obra.latitud},${this.obra.longitud}&ll=${this.obra.latitud},${this.obra.longitud}&z=10`;
  //   return url;
  //   //window.open(url, '_blank');
  // }

  openGoogleMaps(): string {
    let url = '';
    if (this.obra) {
      url = `https://www.google.com/maps?q=${this.obra.latitud},${this.obra.longitud}&ll=${this.obra.latitud},${this.obra.longitud}&z=10`;
      return url;
    }
    return '';
    //window.open(url, '_blank');
  }
}
