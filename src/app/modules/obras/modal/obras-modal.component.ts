import { Component, EventEmitter, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Mensaje } from '../../../models';
import { ObrasService } from '../services/obras.service';
import { Obra } from '../../dashboard/models/obra.interface';

@Component({
  selector: 'app-obras-modal',
  templateUrl: 'obras-modal.component.html',
  styleUrls: ['../obras.component.scss']
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
  public value: number;
  public obra: Obra;
  // end

  private mensaje: Mensaje;

  constructor(public bsModalRef: BsModalRef, private obrasService: ObrasService) {
    this.mensaje = new Mensaje();
    this.eventos = [];
    this.value = 25;
    this.obra = {};
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
      },
      error: (err: unknown) => {
        this.mensaje.showMessage(err);
      }
    });
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
