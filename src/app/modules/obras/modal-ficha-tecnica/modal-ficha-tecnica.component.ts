import { Component, EventEmitter, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Mensaje } from 'src/app/models';

@Component({
  selector: 'app-modal-ficha-tecnica',
  templateUrl: './modal-ficha-tecnica.component.html',
  styleUrls: ['./modal-ficha-tecnica.component.scss']
})
export class ModalFichaTecnicaComponent implements OnInit {
  public cssClass: { color: string; type: string };
  public maximizado: boolean;
  public event: EventEmitter<any> = new EventEmitter();
  public isModal;
  public params: any;
  public modalExtraOptions: any;
  public titlePage = '';

  public mensaje: Mensaje;

  constructor(public bsObraModalRef: BsModalRef) {}

  ngOnInit(): void {
    console.log(this.params);
  }
}
