import { Component, ElementRef, EventEmitter, OnInit, ViewChild } from '@angular/core';
import html2canvas from 'html2canvas';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Mensaje } from 'src/app/models';
import * as jspdf from 'jspdf';
import { ObrasService } from '../services/obras.service';
import { ObraTarjetaInformativa } from '../models/obrareporte.interface';

@Component({
  selector: 'app-modal-tarjeta-informativa',
  templateUrl: './modal-tarjeta-informativa.component.html',
  styleUrls: ['./modal-tarjeta-informativa.component.scss']
})
export class ModalTarjetaInformativaComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  public cssClass: { color: string; type: string };
  public maximizado: boolean;
  public event: EventEmitter<any> = new EventEmitter();
  public isModal;
  public params: any;
  public modalExtraOptions: any;
  public titlePage = '';

  public mensaje: Mensaje;
  public tarjetaInformativa: ObraTarjetaInformativa;
  @ViewChild('tarjetaInformativa') tarjetaInformativaDOM: ElementRef;

  constructor(public bsObraModalRef: BsModalRef, public obrasService: ObrasService) {
    this.mensaje = new Mensaje();
  }

  ngOnInit() {
    this.params.inversionEstimada = this.params.inversionEstimada.toLocaleString('es-MX', {
      style: 'currency',
      currency: 'MXN'
    });

    this.params.urlImagenGrafica = this.params.archivoGraficaAvancesImagen
      ? `data:image/png;base64,${this.params.archivoGraficaAvancesImagen} `
      : '*';

    this.params.urlImagenCroquis = this.params.archivoGraficaAvancesImagen
      ? `data:image/png;base64,${this.params.archivoCroquisImagen} `
      : '*';
  }

  descargarPDF() {
    this.blockUI.start('Descargando...');

    const pdfOptions = {
      orientation: 'p',
      unit: 'mm',
      format: 'a4'
    };

    const pdf = new jspdf(pdfOptions);
    html2canvas(this.tarjetaInformativaDOM.nativeElement, {
      useCORS: true,
      allowTaint: false,
      imageTimeout: 0,
      logging: true
    }).then((canvas) => {
      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.internal.pageSize.height = imgHeight;
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('Tarjeta Informativa.pdf');
      this.blockUI.stop();
    });
  }
}
