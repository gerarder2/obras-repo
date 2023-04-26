import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Mensaje } from '../../models';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Municipio } from '../dashboard/models/municipio.interface';
import { ConfigService } from '../../services';
import { LicitacionesModalComponent } from './modal/licitaciones-modal.component';

@Component({
  selector: 'app-licitaciones',
  templateUrl: './licitaciones.component.html',
  styleUrls: ['./licitaciones.component.scss']
})
export class LicitacionesComponent implements OnInit {
  public licitaciones: any[];
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

  // Variables Mensajes y Modal
  private mensaje: Mensaje;
  private bsModalRef: BsModalRef;
  // ------------------------------------------------ //

  constructor(private fb: FormBuilder, private configService: ConfigService, private bsModalService: BsModalService) {
    const config = this.configService.getConfig();
    this.periodos = config.periodos;
    this.collapsed = false;
    this.mensaje = new Mensaje();
    this.licitaciones = [
      { id: 1, cantidad: 300, descripcion: 'TOTAL DE LICITACIONES', color: 'wine' },
      { id: 2, cantidad: 1182, descripcion: 'EVENTOS DE LICITACION', color: 'wine-800' },
      { id: 3, cantidad: 5, descripcion: 'DEPENDENCIAS/ORGANISMOS', color: 'wine-500' }
    ];

    this.tabla1 = [
      { id: 1, nombre: 'SIDUR', progreso: 40, color: 'wine' },
      { id: 2, nombre: 'CEA', progreso: 50, color: 'green' },
      { id: 3, nombre: 'ISIE', progreso: 65, color: 'gold-500' },
      { id: 2, nombre: 'OTROS', progreso: 70, color: 'gold' }
    ];

    this.tabla2 = [
      { id: 1, nombre: 'SIDUR', progreso: 40 },
      { id: 2, nombre: 'CEA', progreso: 50 },
      { id: 3, nombre: 'ISIE', progreso: 65 },
      { id: 2, nombre: 'OTROS', progreso: 70 }
    ];

    this.tiposObras = [
      { id: 1, nombre: 'Tipo 1' },
      { id: 2, nombre: 'Tipo 2' },
      { id: 3, nombre: 'Tipo 3' }
    ];

    this.licitacionesData = [
      {
        numeroContrato: 'IO-956235',
        objeto:
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s,',
        fecha: '2023-05-05',
        monto: '12032145658',
        avance: 30
      },
      {
        numeroContrato: 'IO-856235',
        objeto:
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s,',
        fecha: '2023-05-05',
        monto: '52032145658',
        avance: 50
      },
      {
        numeroContrato: 'IO-456235',
        objeto:
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s,',
        fecha: '2023-05-05',
        monto: '96032145658',
        avance: 10
      }
    ];

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

    this.tiposObras = [
      { id: 0, descripcion: 'Todos' },
      { id: 1, descripcion: 'Tipo Obra 1' },
      { id: 2, descripcion: 'Tipo Obra 2' },
      { id: 3, descripcion: 'Tipo Obra 3' }
    ];

    this.estatusObras = [
      { id: 0, descripcion: 'Todos los procesos' },
      { id: 1, descripcion: 'Por Hacer' },
      { id: 2, descripcion: 'En Proceso' },
      { id: 3, descripcion: 'Terminado' }
    ];

    this.tiposModalidad = [];
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.filterForm = this.fb.group({
      tipoObra: new FormControl(''),
      municipio: new FormControl(''),
      annio: new FormControl(''),
      tipoModalidad: new FormControl(''),
      organismo: new FormControl(''),
      contratista: new FormControl(''),
      tipoContrato: new FormControl('')
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
      class: 'modal-light modal-lg',
      backdrop: 'static',
      keyboard: true,
      ignoreBackdropClick: true
    });

    this.bsModalRef.content.event.subscribe((res) => {
      console.warn(res);
    });

    this.bsModalService.onHide.subscribe((reason: string) => {});
  }
}
