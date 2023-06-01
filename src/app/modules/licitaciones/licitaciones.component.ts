import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Mensaje } from '../../models';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Municipio } from '../dashboard/models/municipio.interface';
import { ConfigService } from '../../services';
import { LicitacionesModalComponent } from './modal/licitaciones-modal.component';
import { CatalogosService } from '../../services/catalogos.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { LicitacionesService } from './services/licitaciones.service';
import { HelperService } from '../../helpers/helper.service';

@Component({
  selector: 'app-licitaciones',
  templateUrl: './licitaciones.component.html',
  styleUrls: ['./licitaciones.component.scss']
})
export class LicitacionesComponent implements OnInit {
  @BlockUI('licitaciones-page') blockUIList: NgBlockUI;

  public cardLicitaciones: any[];
  public tabla1: any[];
  public tabla2: any[];
  public collapsed: boolean;

  public filterForm: FormGroup;
  public licitacionesData: any[];

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
  public totalLicitaciones: number;
  public montoMaximoContratos: number;

  // Variables Mensajes y Modal
  private mensaje: Mensaje;
  private bsModalRef: BsModalRef;
  private config;

  //Variables data
  public licitacionesTabla: any[];
  public licitacionesPorDependencia: any[];
  public eventosPorDependencia: any[];

  // ------------------------------------------------ //

  constructor(
    private fb: FormBuilder,
    private configService: ConfigService,
    private bsModalService: BsModalService,
    private catalogosService: CatalogosService,
    private licitacionesService: LicitacionesService,
    private helperService: HelperService
  ) {
    this.config = this.configService.getConfig();
    this.collapsed = false;
    this.mensaje = new Mensaje();
    this.cardLicitaciones = [
      { id: 1, cantidad: 0, descripcion: 'TOTAL DE LICITACIONES', color: 'wine-800' },
      { id: 2, cantidad: 0, descripcion: 'EVENTOS DE LICITACION', color: 'wine-800' },
      { id: 3, cantidad: 0, descripcion: 'DEPENDENCIAS / ORGANISMOS', color: 'wine-800' }
    ];

    this.tabla1 = [];

    this.tabla2 = [];

    this.licitacionesData = [
      // {
      //   numeroContrato: 'IO-956235',
      //   objeto:
      //     'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s,',
      //   fecha: '2023-05-05',
      //   monto: '12032145658',
      //   avance: 30
      // },
      // {
      //   numeroContrato: 'IO-856235',
      //   objeto:
      //     'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s,',
      //   fecha: '2023-05-05',
      //   monto: '52032145658',
      //   avance: 50
      // },
      // {
      //   numeroContrato: 'IO-456235',
      //   objeto:
      //     'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s,',
      //   fecha: '2023-05-05',
      //   monto: '96032145658',
      //   avance: 10
      // }
    ];

    this.licitacionesTabla = [];
    this.licitacionesPorDependencia = [];
    this.eventosPorDependencia = [];

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
    this.loadLicitacionesData();
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

  public loadLicitacionesData() {
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

    this.licitacionesService.getLicitacionDatos(queryParams).subscribe({
      next: (response: any) => {
        this.licitacionesTabla = response.data.licitaciones;
        //this.licitacionesPorDependencia = this.helperService.calcularAvanceObra(response.data.obrasPorTipo);
        //this.eventosPorDependencia = this.helperService.calcularAvanceObraEjercicio(response.data.obrasPorEjercicio);

        // const sum = this.licitacionesData.reduce((accumulator, element) => {
        //   return accumulator + element.montoInversion;
        // }, 0);
        this.totalLicitaciones = this.licitacionesTabla.length;
        this.cardLicitaciones[0].cantidad = this.totalLicitaciones;
        // this.montoTotalEjercido = sum;
        // this.montoMaximoContratos = sum;
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
    console.log(opciones);
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

    this.bsModalRef = this.bsModalService.show(LicitacionesModalComponent, {
      initialState,
      class: 'modal-primary modal-fullscreen',
      backdrop: 'static',
      keyboard: true,
      ignoreBackdropClick: true
    });

    this.bsModalRef.content.event.subscribe((res) => {
      console.warn(res);
    });

    this.bsModalService.onHide.subscribe((reason: string) => {});
  }

  public filtrar() {
    this.loadLicitacionesData();
  }

  public resetForm() {
    this.filterForm.reset();
    setTimeout(() => {
      this.initializeForm();
    }, 100);
  }
}
