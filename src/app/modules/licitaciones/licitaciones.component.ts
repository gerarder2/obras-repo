import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Mensaje } from '../../models';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AppModalComponent } from '../../shared-components/app-modal/app-modal.component';

@Component({
  selector: 'app-licitaciones',
  templateUrl: './licitaciones.component.html',
  styleUrls: ['./licitaciones.component.scss']
})
export class LicitacionesComponent implements OnInit {
  public licitaciones: any[];
  public tabla1: any[];
  public tabla2: any[];
  public tiposObra: any[];
  public collapsed: boolean;

  public filterForm: FormGroup;
  public licitacionesData: any[];

  // Variables Mensajes y Modal
  private mensaje: Mensaje;
  private bsModalRef: BsModalRef;
  // ------------------------------------------------ //

  constructor(private fb: FormBuilder, private bsModalService: BsModalService) {
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

    this.tiposObra = [
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

    this.bsModalRef = this.bsModalService.show(AppModalComponent, {
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
