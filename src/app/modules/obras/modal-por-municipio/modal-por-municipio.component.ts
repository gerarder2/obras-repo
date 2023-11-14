import { AfterViewInit, Component, EventEmitter, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ObrasService } from '../services/obras.service';
import { Mensaje } from 'src/app/models';
import { DatosReportePorMunicipio, ObraPortalReporte, ObraReporte } from '../models/obrareporte.interface';

@Component({
  selector: 'app-modal-por-municipio',
  templateUrl: './modal-por-municipio.component.html',
  styleUrls: ['./modal-por-municipio.component.scss']
})
export class ModalPorMunicipioComponent implements OnInit {
  public cssClass: { color: string; type: string };
  public maximizado: boolean;
  public event: EventEmitter<any> = new EventEmitter();
  public isModal;
  public params: any;
  public modalExtraOptions: any;
  public titlePage = '';

  public mensaje: Mensaje;
  public fechaConsulta = new Date();
  public montoGlobal = 0;
  public porcentajeInversionTotal = 0;
  public inversionGeneral: number;
  public datosGlobalesMunicipio: DatosReportePorMunicipio[] = [];

  allObras: ObraReporte[];
  constructor(public bsObraModalRef: BsModalRef, private obrasService: ObrasService) {
    this.mensaje = new Mensaje();
  }

  ngOnInit(): void {
    this.getDataObras();
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
        const btns = document.querySelectorAll('.btnExpandir');
        btns.forEach((boton: HTMLElement) => {
          boton.click();
        });
      },
      error: (err: unknown) => {
        console.warn(err);
        this.mensaje.showMessage(err);
      }
    });
  }

  calcularTotales(tipoObra, municipio, campo) {
    return this.allObras
      .filter((x) => x.descripcionTipoObra === tipoObra && x.nombreMunicipio === municipio)
      .reduce((total, obj) => total + obj[campo], 0);
  }
}
