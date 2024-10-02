import { Component, EventEmitter, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ObrasService } from '../services/obras.service';
import { Mensaje } from 'src/app/models';
import { DatosReportePorMunicipio, ObraReporte } from '../models/obrareporte.interface';
import { ModalFichaTecnicaComponent } from '../modal-ficha-tecnica/modal-ficha-tecnica.component';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { HttpErrorResponse } from '@angular/common/http';
import { ModalTarjetaInformativaComponent } from '../modal-tarjeta-informativa/modal-tarjeta-informativa.component';

@Component({
  selector: 'app-modal-por-municipio',
  templateUrl: './modal-por-municipio.component.html',
  styleUrls: ['./modal-por-municipio.component.scss']
})
export class ModalPorMunicipioComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  public cssClass: { color: string; type: string };
  public maximizado: boolean;
  public event: EventEmitter<any> = new EventEmitter();
  public isModal;
  public params: any;
  public modalExtraOptions: any;
  public titlePage = '';

  public mensaje: Mensaje;
  public fechaConsulta = new Date();
  public inversionGeneral: number;
  public datosGlobalesMunicipio: DatosReportePorMunicipio;

  bsModalRef: BsModalRef;
  allObras: ObraReporte[];

  constructor(
    public bsObraModalRef: BsModalRef,
    private obrasService: ObrasService,
    private bsModalService: BsModalService
  ) {
    this.mensaje = new Mensaje();
  }

  ngOnInit(): void {
    this.getDataObras();
  }

  descargarPDF() {
    this.blockUI.start('Descargando...');
    this.obrasService.descargarReportePorMunicipio(this.params).subscribe(
      (data: Blob) => {
        const url = window.URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Reporte por municipio.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
        this.blockUI.stop();
      },
      (err: unknown) => {
        this.blockUI.stop();
        if (err instanceof HttpErrorResponse && err.error instanceof Blob) {
          const reader = new FileReader();
          reader.onload = () => {
            const errorObj = JSON.parse(reader.result as string);
            this.mensaje.showMessage(errorObj);
          };
          reader.readAsText(err.error);
        } else {
          this.mensaje.messageWarning('Ocurrio un error al intentar descargar el archivo.');
        }
      }
    );
  }

  getDataObras() {
    this.obrasService.getObrasReporte(this.params).subscribe({
      next: (response) => {
        this.allObras = response.data.obras;
        this.inversionGeneral = response.data.inversionTotal;
        const importeTotalMunicipio = this.allObras.reduce((total, obj) => total + obj.montoInversion, 0);

        this.datosGlobalesMunicipio = {
          inversion: importeTotalMunicipio,
          porcentajeInversion: (importeTotalMunicipio / this.inversionGeneral) * 100,
          municipio: this.allObras[0].nombreMunicipio
        };
      },
      error: (err: unknown) => {
        this.mensaje.showMessage(err);
        this.bsObraModalRef.hide();
      }
    });
  }

  mostrarFicha(obra: any) {
    this.openModalComponent(obra);
  }

  mostrarTarjetaInformativa(obra: any) {
    this.verTarjetaInformativa(obra);
  }

  openModalComponent(obra: any) {
    const initialState = {
      params: obra,
      isModal: true,
      modalExtraOptions: {
        closeButton: true,
        closeButtonText: 'Cancelar',
        acceptButton: true,
        acceptButtonText: 'Aceptar'
      }
    };

    this.bsModalRef = this.bsModalService.show(ModalFichaTecnicaComponent, {
      initialState,
      class: 'modal-primary modal-lg',
      backdrop: 'static',
      keyboard: true,
      ignoreBackdropClick: true
    });

    this.bsModalRef.content.event.subscribe((res) => {
      console.warn(res);
    });

    this.bsModalService.onHide.subscribe((reason: string) => {});
  }

  public verTarjetaInformativa(item: any) {
    this.obrasService.getTarjetaInformativa(item).subscribe({
      next: (response: any) => {
        const objeto = item.objeto;
        const data = { ...response.data, objeto };
        this.abreModalTarjetaInformativa(data);
      },
      error: (err: unknown) => {
        this.mensaje.showMessage(err);
      }
    });
  }

  abreModalTarjetaInformativa(data) {
    const initialState = {
      params: data,
      isModal: true,
      modalExtraOptions: {
        closeButton: true,
        closeButtonText: 'Cancelar',
        acceptButton: true,
        acceptButtonText: 'Aceptar'
      }
    };

    this.bsModalRef = this.bsModalService.show(ModalTarjetaInformativaComponent, {
      initialState,
      class: 'modal-primary modal-lg',
      backdrop: 'static',
      keyboard: true,
      ignoreBackdropClick: true
    });

    this.bsModalRef.content.event.subscribe((res) => {
      console.warn(res);
    });

    this.bsModalService.onHide.subscribe((reason: string) => {});
  }

  calcularTotales(tipoObra, municipio, campo) {
    return this.allObras
      .filter((x) => x.descripcionTipoObra === tipoObra && x.nombreMunicipio === municipio)
      .reduce((total, obj) => total + obj[campo], 0);
  }

  calcularPromedio(tipoObra, municipio, campo) {
    const totalObras = this.allObras.filter(
      (x) => x.descripcionTipoObra === tipoObra && x.nombreMunicipio === municipio
    );
    const totalPorcentaje = this.allObras
      .filter((x) => x.descripcionTipoObra === tipoObra && x.nombreMunicipio === municipio)
      .reduce((total, obj) => total + obj[campo], 0);

    return totalPorcentaje / totalObras.length;
  }
}
