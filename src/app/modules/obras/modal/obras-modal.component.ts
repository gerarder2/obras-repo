import { Component, EventEmitter, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Mensaje } from '../../../models';

@Component({
  selector: 'app-obras-modal',
  templateUrl: 'obras-modal.component.html'
})
export class ObrasModalComponent implements OnInit {
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
