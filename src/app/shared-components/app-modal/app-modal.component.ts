import { Component, EventEmitter, OnInit } from '@angular/core';
import { Mensaje } from '../../models';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal',
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
            <small>Tipo de Licitacion</small>
            <p>{{ params.tipoLicitacion }}</p>
          </div>
          <div class="col-3">
            <small>Fecha</small>
            <p>{{ params.fecha }}</p>
          </div>
          <div class="col-3">
            <small>Normatividad</small>
            <p>Federal</p>
          </div>
        </div>
        <div class="row">
          <div class="col-12"></div>
        </div>
      </div>
    </div>
  `
})
export class AppModalComponent implements OnInit {
  // Variables Modal
  public cssClass: { color: string; type: string };
  public maximizado: boolean;
  public event: EventEmitter<any> = new EventEmitter();
  public isModal;
  public params: any;
  public modalExtraOptions: any;
  public titlePage = 'asdf';
  // end

  private mensaje: Mensaje;

  constructor(public bsModalRef: BsModalRef) {
    this.mensaje = new Mensaje();
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
