import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ObrasService } from '../services/obras.service';
import { Mensaje } from 'src/app/models';
import { DatosReportePorMunicipio, ObraReporte } from '../models/obrareporte.interface';
import { ModalFichaTecnicaComponent } from '../modal-ficha-tecnica/modal-ficha-tecnica.component';

@Component({
  selector: 'app-modal-por-municipio',
  templateUrl: './modal-por-municipio.component.html',
  styleUrls: ['./modal-por-municipio.component.scss']
})
export class ModalPorMunicipioComponent implements OnInit, AfterViewInit {
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
  public datosGlobalesMunicipio: DatosReportePorMunicipio[] = [];

  bsModalRef: BsModalRef;
  allObras: ObraReporte[];

  constructor(
    public bsObraModalRef: BsModalRef,
    private obrasService: ObrasService,
    private bsModalService: BsModalService,
    private el: ElementRef
  ) {
    this.mensaje = new Mensaje();
  }

  ngOnInit(): void {
    this.getDataObras();
  }

  ngAfterViewInit() {
    const intervalId = setInterval(() => {
      const buttons = this.el.nativeElement.querySelectorAll('.btnExpandir');
      if (buttons.length) {
        clearInterval(intervalId);
        buttons.forEach((button: HTMLElement) => {
          button.click();
        });
      }
    }, 100);
  }

  getDataObras() {
    this.obrasService.getObrasReporte(this.params).subscribe({
      next: (response) => {
        this.allObras = response.data.obras;
        this.inversionGeneral = response.data.inversionTotal;

        this.datosGlobalesMunicipio = this.allObras.reduce((acumulador, objeto) => {
          const municipioExistente = acumulador.find((item) => item.municipio === objeto.nombreMunicipio);

          if (municipioExistente) {
            municipioExistente.inversion += objeto.montoInversion;
          } else {
            const obrasMunicipio = this.allObras.filter((x) => x.nombreMunicipio === objeto.nombreMunicipio);
            const tipoObras = Array.from(
              new Set(
                this.allObras
                  .filter((obra) => obra.nombreMunicipio === objeto.nombreMunicipio)
                  .map((x) => x.descripcionTipoObra)
              )
            );
            acumulador.push({
              municipio: objeto.nombreMunicipio,
              inversion: objeto.montoInversion,
              porcentajeInversion: 0,
              tiposObra: [...tipoObras],
              obras: obrasMunicipio
            });
          }

          return acumulador;
        }, []);

        this.datosGlobalesMunicipio.forEach((item) => {
          item.porcentajeInversion = item.inversion / this.inversionGeneral;
        });
      },
      error: (err: unknown) => {
        this.mensaje.showMessage(err);
      }
    });
  }

  mostrarFicha(obra: any) {
    this.openModalComponent(obra);
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
