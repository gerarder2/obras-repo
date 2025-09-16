import { HelperService } from './../../helpers/helper.service';
import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ObrasModalComponent } from './modal/obras-modal.component';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Mensaje } from '../../models';
import { ConfigService } from '../../services';
import { Municipio } from '../dashboard/models/municipio.interface';
import { CatalogosService } from '../../services/catalogos.service';
import { ObrasService } from './services/obras.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { environment } from '../../../environments/environment';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-obras',
  templateUrl: './obras.component.html',
  styleUrls: ['./obras.component.scss']
})
export class ObrasComponent implements OnInit, AfterViewInit, OnDestroy {
  @BlockUI('obras-page') blockUIList: NgBlockUI;

  public cardObras: any[];
  public tabla1: any[];
  public tabla2: any[];
  public collapsed: boolean;

  @ViewChild('obrasDoughnutCanvas', { static: false }) obrasDoughnutCanvas!: ElementRef<HTMLCanvasElement>;
  private obrasDoughnutChart?: Chart;

  public filterForm: FormGroup;
  public obrasTabla: any[];

  //Catalogos
  public tiposObras: any[];
  public municipios: Municipio[];
  public estatusObras: any[];
  public periodos: any[];
  public tiposModalidad: any[];
  public contratistas: any[];
  public tiposContrato: any[];
  public organismos: any[];

  public montoTotalEjercido: number;
  public totalContratos: number;
  public montoMaximoContratos: number;

  public develop: boolean;

  // Variables Mensajes y Modal
  private mensaje: Mensaje;
  private bsObraModalRef: BsModalRef;
  private config;
  // ------------------------------------------------ //

  constructor(
    private fb: FormBuilder,
    private configService: ConfigService,
    private bsModalService: BsModalService,
    private catalogosService: CatalogosService,
    private obrassService: ObrasService,
    private helperService: HelperService
  ) {
    this.develop = !environment.production;
    this.config = this.configService.getConfig();
    this.collapsed = false;
    this.mensaje = new Mensaje();

    this.cardObras = [
      { id: 1, cantidad: 0, descripcion: 'TOTAL DE CONTRATOS', color: 'gold-500' },
      { id: 2, cantidad: 0, descripcion: 'MONTO TOTAL EJERCIDO (MXN)', color: 'wine-100' },
      { id: 3, cantidad: 0, descripcion: 'MONTO MAXIMO EN CONTRATOS', color: 'wine-50' }
    ];

    this.tabla1 = [];

    this.tabla2 = [];

    this.obrasTabla = [];

    this.municipios = [
      { id: 0, nombre: 'TODOS LOS MUNICIPIOS', latitud: 25.91194, longitud: -109.1735 },
      { id: 1, nombre: 'AHOME', latitud: 25.91194, longitud: -109.1735 },
      { id: 2, nombre: 'ANGOSTURA', latitud: 25.36797, longitud: -108.15913 },
      { id: 3, nombre: 'BADIRAGUATO', latitud: 25.36285, longitud: -107.54986 },
      { id: 4, nombre: 'CONCORDIA', latitud: 23.28819, longitud: -106.06721 },
      { id: 5, nombre: 'COSALA', latitud: 24.73518, longitud: -106.90657 },
      { id: 6, nombre: 'CULIACÁN', latitud: 24.59119, longitud: -107.39151 },
      { id: 7, nombre: 'CHOIX', latitud: 26.80709, longitud: -108.42723 },
      { id: 8, nombre: 'ELOTA', latitud: 24.08861, longitud: -106.82452 },
      { id: 9, nombre: 'ESCUINAPA', latitud: 22.78469, longitud: -105.85171 },
      { id: 10, nombre: 'EL FUERTE', latitud: 25.90437, longitud: -108.94429 },
      { id: 11, nombre: 'GUASAVE', latitud: 25.526, longitud: -108.60869 },
      { id: 12, nombre: 'MAZATLAN', latitud: 23.1615, longitud: -106.2645 },
      { id: 13, nombre: 'MOCORITO', latitud: 25.00644, longitud: -107.63246 },
      { id: 14, nombre: 'ROSARIO', latitud: 22.9921295, longitud: -105.899264 },
      { id: 15, nombre: 'SALVADOR ALVARADO', latitud: 25.4819, longitud: -108.16205 },
      { id: 16, nombre: 'SAN IGNACIO', latitud: 24.07914, longitud: -106.37004 },
      { id: 17, nombre: 'SINALOA', latitud: 25.69983, longitud: -107.87211 },
      { id: 18, nombre: 'NAVOLATO', latitud: 24.65792, longitud: -107.53742 }
    ];

    this.periodos = this.config.periodos;
    this.tiposObras = [];
    this.tiposModalidad = [];
    this.organismos = [];
    this.contratistas = [];
    this.tiposContrato = [];
  }

  ngOnInit(): void {
    this.loadCatalogos();
    this.initializeForm();
    this.loadObrasData();
  }

  ngAfterViewInit(): void {
    // intenta crear la gráfica después de que exista el canvas
    this.createOrUpdateChart();
  }

  ngOnDestroy(): void {
    this.obrasDoughnutChart?.destroy();
  }

  public loadCatalogos() {
    this.catalogosService.getCatalogos().subscribe({
      next: (response: any[]) => {
        this.tiposObras = response[0].data;
        this.tiposModalidad = response[1].data;
        this.organismos = response[2].data;
        this.contratistas = response[3].data;
        this.tiposContrato = response[4].data;

        this.tiposObras.unshift({ id: 0, descripcion: 'Todas' });
        this.tiposModalidad.unshift({ id: 0, descripcion: 'Todas' });
        this.organismos.unshift({ id: 0, nombre: 'Todos' });
        this.contratistas.unshift({ id: 0, nombreCompleto: 'Todos' });
        this.tiposContrato.unshift({ id: 0, descripcion: 'Todos' });
      },
      error: (err: unknown) => {
        console.warn(err);
        this.mensaje.showMessage(err);
      }
    });
  }

  public loadObrasData() {
    this.blockUIList.start('Cargando...');
    const queryParams = this.filterForm.value;

    if (!queryParams.numeroContrato) {
      queryParams.numeroContrato = 0;
    }

    if (queryParams.ejercicio > 0) {
      const ejercicio = this.periodos.find((e) => e.id === queryParams.ejercicio);
      if (ejercicio) {
        queryParams.ejercicio = ejercicio.descripcion;
      }
    }
    console.log(queryParams);
    // const queryParamsAux = { ...queryParams, idEtiqueta: 0 };

    this.obrassService.getObrasDatos(queryParams).subscribe({

      next: (response: any) => {
        this.obrasTabla = response.data.obras;
        this.tabla1 = this.helperService.calcularAvanceObra(response.data.obrasPorTipo);

        this.tabla2 = this.helperService.calcularAvanceObraEjercicio(response.data.obrasPorEjercicio);

        const sum = this.obrasTabla.reduce((accumulator, element) => {
          return accumulator + element.montoInversion;
        }, 0);
        this.totalContratos = this.obrasTabla.length;
        this.montoTotalEjercido = sum;
        this.montoMaximoContratos = sum;
        // actualizar gráfica cuando los datos llegan
        this.createOrUpdateChart();
        this.blockUIList.stop();
      },
      error: (err: unknown) => {
        console.warn(err);
        this.blockUIList.stop();
        this.mensaje.showMessage(err);
      }
    });
  }

  public initializeForm() {
    this.filterForm = this.fb.group({
      idEtiqueta: new FormControl(0),
      numeroContrato: new FormControl(''),
      idTipoObraSocial: new FormControl(0),
      idMunicipio: new FormControl(0),
      ejercicio: new FormControl(0),
      idTipoModalidad: new FormControl(0),
      idDependencia: new FormControl(0),
      idContratista: new FormControl(0),
      idTipoContrato: new FormControl(0)
    });
  }

  // SECCION CONFIGURACION MODAL
  public openModalComponent(opciones?: any) {
    const initialState = {
      params: opciones ? opciones : {},
      isModal: true,
      modalExtraOptions: {
        closeButton: true,
        closeButtonText: 'Cancelar',
        acceptButton: true,
        acceptButtonText: 'Aceptar'
      }
    };

    this.bsObraModalRef = this.bsModalService.show(ObrasModalComponent, {
      initialState,
      class: 'modal-primary modal-fullscreen',
      backdrop: 'static',
      keyboard: false,
      ignoreBackdropClick: true
    });

    this.bsObraModalRef.content.event.subscribe((res) => {
      console.warn(res);
    });

    this.bsModalService.onHide.subscribe((reason: string) => {});
  }

  public filtrar() {
    this.loadObrasData();
  }

  public resetForm() {
    this.filterForm.reset();
    setTimeout(() => {
      this.initializeForm();
    }, 100);
  }

  // controla qué filtro está activo; null = ocultar tabla
  public activeDetailFilter: 'porIniciar' | 'enProceso' | 'terminadas' | null = null;

  // índice para p-table (paginación). se resetea a 0 al cambiar filtro
  public tableFirst = 0;

  public toggleDetalle(tipo: 'porIniciar' | 'enProceso' | 'terminadas') {
    this.activeDetailFilter = this.activeDetailFilter === tipo ? null : tipo;
    this.tableFirst = 0; // volver a la página 1
  }

  // getter ya usado en la plantilla
  public get filteredObras(): any[] {
    const list = this.obrasTabla ?? [];
    if (!this.activeDetailFilter) { return list; }
    if (this.activeDetailFilter === 'porIniciar') {
      return list.filter(o => Number(o.porcentajeAvance) === 0);
    }
    if (this.activeDetailFilter === 'enProceso') {
      return list.filter(o => { const p = Number(o.porcentajeAvance); return p > 0 && p < 100; });
    }
    return list.filter(o => Number(o.porcentajeAvance) === 100);
  }

  // computed property for template (safe: handles null/undefined)
  get obrasPorIniciar(): number {
    return (this.obrasTabla || []).filter(item => item.porcentajeAvance === 0.0).length;
  }
  get obrasEnProceso(): number {
    return (this.obrasTabla || []).filter(item => (item.porcentajeAvance < 100.0 && item.porcentajeAvance > 0.0)).length;
  }
  get obrasTerminadas(): number {
    return (this.obrasTabla || []).filter(item => item.porcentajeAvance === 100.0).length;
  }

  // crea o actualiza la gráfica doughnut usando Chart.js
  private createOrUpdateChart(retry = 0): void {
    const MAX_RETRY = 6;

    // si el canvas aún no está disponible (llamado antes de AfterViewInit), reintentar
    if (!this.obrasDoughnutCanvas) {
      if (retry < MAX_RETRY) {
        setTimeout(() => this.createOrUpdateChart(retry + 1), 150);
      }
      return;
    }

    const canvas = this.obrasDoughnutCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const counts = this.computeObrasCounts();
    const dataValues = [counts.terminadas, counts.enProceso, counts.porIniciar];

    const data = {
      labels: ['Terminadas', 'En proceso', 'Por iniciar'],
      datasets: [
        {
          data: dataValues,
          backgroundColor: ['#265d50', '#6b1d2b', '#c99b70'],
          borderColor: ['#ffffff', '#ffffff', '#ffffff'],
          borderWidth: 2,
          hoverOffset: 6
        }
      ]
    };

    const options: any = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: { boxWidth: 12, padding: 12 },
          
          onClick: (e: MouseEvent, legendItem: any, legend: any) => {
            
            const chart = legend.chart as any;
            const idx = legendItem.index;
            if (!chart) { return; }
            chart.setActiveElements([{ datasetIndex: 0, index: idx }]);
            chart.tooltip.setActiveElements([{ datasetIndex: 0, index: idx }], {x: 0, y: 0});
            chart.update();
          },
          onHover: (e: MouseEvent, legendItem: any, legend: any) => {
            const chart = legend.chart as any;
            const idx = legendItem.index;
            if (!chart) { return; }
            chart.setActiveElements([{ datasetIndex: 0, index: idx }]);
            chart.update();
          },
          onLeave: (e: MouseEvent, legendItem: any, legend: any) => {
            const chart = legend.chart as any;
            if (!chart) { return; }
            chart.setActiveElements([]);
            chart.update();
          }
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const val = context.parsed ?? 0;
              const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0) || 1;
              const pct = (val / total) * 100;
              return `${context.label}: ${val} (${pct.toFixed(1)}%)`;
            }
          }
        }
      },
      cutout: '60%'
    };

    // destruir chart previa si existe (para evitar duplicados)
    if (this.obrasDoughnutChart) {
      try {
        this.obrasDoughnutChart.data = data as any;
        this.obrasDoughnutChart.options = options;
        this.obrasDoughnutChart.update();
        return;
      } catch (e) {
        this.obrasDoughnutChart.destroy();
        this.obrasDoughnutChart = undefined;
      }
    }

    // crear nueva instancia
    this.obrasDoughnutChart = new Chart(ctx, {
      type: 'doughnut',
      data,
      options
    }) as Chart;
  }

  // cuenta las obras según avance
  private computeObrasCounts() {
    const list = this.obrasTabla ?? [];
    let porIniciar = 0, enProceso = 0, terminadas = 0;
    for (const o of list) {
      const p = Number(o.porcentajeAvance);
      if (p === 100) terminadas++;
      else if (p === 0) porIniciar++;
      else if (p > 0 && p < 100) enProceso++;
    }
    return { porIniciar, enProceso, terminadas };
  }
}
