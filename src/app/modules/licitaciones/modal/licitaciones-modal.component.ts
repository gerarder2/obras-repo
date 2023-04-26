import { Component, EventEmitter, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Mensaje } from '../../../models/mensaje';

@Component({
  selector: 'app-licitaciones-modal',
  styleUrls: ['../licitaciones.component.scss'],
  template: `
    <!-- modal -->
    <div class="modal-header" ngxModalDraggable>
      <div class="container">
        <div class="row">
          <div class="col-sm-4">
            <small>Numero de licitacion</small>
            <p>{{ params.numeroContrato }}</p>
          </div>
          <div class="col-sm-4">
            <small>Numero de Contrato</small>
            <p>{{ params.numeroContrato }}</p>
          </div>
          <div class="form-inline col-sm-3">
            <button class="btn btn-primary"><i class="fas fa-eye"></i> Ver Obra</button>
          </div>
        </div>
      </div>
      <div class="ml-auto">
        <button type="button" class="close" (click)="bsModalRef.hide()">
          <span aria-hidden="true"><i class="fa fa-close"></i></span>
        </button>
      </div>
    </div>
    <div class="modal-body">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <small>Objeto</small>
            <p>{{ params.objeto }}</p>
          </div>
        </div>
        <div class="row">
          <div class="col-6">
            <small><strong>Tipo de Licitacion</strong></small>
            <p>{{ params.tipoLicitacion }}</p>
          </div>
          <div class="col-3">
            <small><strong>Fecha</strong></small>
            <p>{{ params.fecha }}</p>
          </div>
          <div class="col-3">
            <small><strong>Normatividad</strong></small>
            <p>Federal</p>
          </div>
        </div>
        <div class="row">
          <div class="col-12"></div>
        </div>
        <div class="row">
          <div class="col-12">
            <p-table
              [ngClass]="{ odd: true }"
              [value]="eventos"
              [tableStyle]="{ 'min-width': '60rem' }"
              styleClass="p-datatable-sm p-datatable-striped"
            >
              <ng-template pTemplate="header">
                <tr>
                  <th>Evento</th>
                  <th>Fecha</th>
                  <th>Evidencia</th>
                  <th>Documentos</th>
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-product>
                <tr>
                  <td>{{ product.evento }}</td>
                  <td>
                    {{ product.fecha }}
                  </td>
                  <td>
                    <button class="btn btn-primary"><i class="fas fa-play    "></i> ver Video</button>
                  </td>
                  <td>
                    <button class="btn btn-primary"><i class="fas fa-file-download    "></i> Documento</button>
                  </td>
                </tr>
              </ng-template>
            </p-table>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LicitacionesModalComponent implements OnInit {
  // Variables Modal
  public cssClass: { color: string; type: string };
  public maximizado: boolean;
  public event: EventEmitter<any> = new EventEmitter();
  public isModal;
  public params: any;
  public modalExtraOptions: any;
  public titlePage = 'asdf';
  public eventos: any[];
  // end

  private mensaje: Mensaje;

  constructor(public bsModalRef: BsModalRef) {
    this.mensaje = new Mensaje();
    this.eventos = [
      { evento: 'Visita', fecha: '2023-01-30 15:00', evidencia: '', documentos: '' },
      { evento: 'Junta', fecha: '2023-01-30 15:00', evidencia: '', documentos: '' },
      { evento: 'Apertura', fecha: '2023-01-30 15:00', evidencia: '', documentos: '' },
      { evento: 'Fallo', fecha: '2023-01-30 15:00', evidencia: '', documentos: '' }
    ];
  }

  // Angular metodos del ciclo de vida del componente
  ngOnInit(): void {
    console.log(this.params);
  }
  // ------------------------------------------------- //

  // Cerrar el modal, ademas envia la informacion al componente list correspondiente. No modificar
  private closeModal(data: any) {
    const response = {
      data
    };
    this.event.next(response);
    this.bsModalRef.hide();
  }
}
