import { Component, EventEmitter, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Mensaje } from '../../../models/mensaje';
import { ObrasModalComponent } from '../../obras/modal/obras-modal.component';

@Component({
  selector: 'app-licitaciones-modal',
  styleUrls: ['../licitaciones.component.scss'],
  template: `
    <style>
      /* solo el texto del tab seleccionado en color tinto */
      .nav-tabs .nav-link.active { color: #6b1d2b !important; font-weight: bold; }
      .nav-tabs .nav-link { color: inherit; }
      .dg-amount { color: #6b1d2b; font-size: 1.9rem; font-weight:700; }
      .dg-title { font-size: 1.05rem; margin-bottom: 1rem; color: #333; }
      .dg-metric { text-align:center; }
      .dg-metric .value { font-size:1.5rem; font-weight:700; color:#6b1d2b; }
      .dg-small { color:#666; font-size:0.85rem; }
      /* thumbnails agrandadas */
      .thumb { width:140px; height:100px; object-fit:cover; border-radius:6px; margin-right:8px; border:1px solid #e6e6e6; }
      .dg-actions .btn { margin-right:0.6rem; background:#6b1d2b; color:#fff; border:none; }
      .dg-row { padding-top:1rem; padding-bottom:1rem; border-top:1px solid #eee; }
      .dg-label { font-weight:600; color:#444; font-size:0.85rem; }
      .dg-label-large { font-size:1.1rem; font-weight:700; color:#333; }
      /* contenedor de evidencia con borde — permite multi-fila */
      .dg-evidence { border:1.5px solid #e6e6e6; padding:0.6rem; border-radius:6px; background:#fff; display:flex; align-items:center; gap:12px; flex-wrap:wrap; }

     /* gauge semicircular (ajustado para quedar igual a la imagen) */
     .dg-gauge { display:flex; flex-direction:column; align-items:center; justify-content:flex-start; gap:6px; }
     .dg-gauge .gauge {
       width:120px;
       height:64px;
       border-top-left-radius:120px;
       border-top-right-radius:120px;
       overflow:hidden;
       position:relative;
       /* fallback neutral bg */
       background: conic-gradient(#e0e0e0 0deg, #e0e0e0 180deg);
     }
     /* inner white semicircle to create ring effect */
     .dg-gauge .gauge-inner {
       position:absolute;
       left:50%;
       bottom:6px;
       transform:translateX(-50%);
       width:72px;
       height:42px;
       background:#fff;
       border-top-left-radius:72px;
       border-top-right-radius:72px;
     }
     .dg-gauge .gauge-value {
       font-size:32px;
       font-weight:700;
       color:#6b1d2b;
       line-height:1;
     }
     .dg-gauge .gauge-sub { color:#666; font-size:12px; }
    </style>

    <div class="modal-header" ngxModalDraggable>
      <div class="container no-cursor">
        <div class="row align-items-start">
          <div class="col-6" *ngIf="params.numeroContrato != null">
            <small>Número de Contrato</small>
            <p style="margin-bottom:0.25rem;">{{ params.numeroContrato }}</p>
          </div>

          <div class="col-6 text-right" *ngIf="params.fechaContratacion">
            <small>Fecha de Contrato</small>
            <p style="margin-bottom:0;">
              {{ params.fechaContratacion | date:"d 'de' MMMM 'de' yyyy":'' : 'es' }}
            </p>
          </div>
        </div>
      </div>

      <div class="ml-auto">
        <button type="button" class="close" (click)="bsLicitacionModalRef.hide()">
          <span aria-hidden="true"><i class="fa fa-close"></i></span>
        </button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="modal-body" style="padding:0;">
      <ul class="nav nav-tabs" role="tablist" style="margin:0 1rem;">
        <li class="nav-item">
          <a class="nav-link active" data-toggle="tab" href="#datosGenerales" role="tab">DATOS GENERALES</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" data-toggle="tab" href="#licitacionTab" role="tab">LICITACIÓN</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" data-toggle="tab" href="#avancesTab" role="tab">AVANCES</a>
        </li>
      </ul>

      <div class="tab-content" style="padding:0.2rem; overflow:auto;">
        <!-- DATOS GENERALES - nuevo diseño -->
        <div class="tab-pane fade show active" id="datosGenerales" role="tabpanel">
          <div class="row">
            <div class="col-md-5">
              <div class="dg-label"> Monto Total Contratado </div>
              <div class="dg-amount">
              $ {{ montoContratado | number:'1.2-2' }} MXN
              </div>
               <div class="dg-label dg-label-large" style="margin-top:2rem;">Nombre de la Obra</div>
              <div class="dg-title">{{ params.objeto || '-' }}</div>

              <div class="dg-row">
                <div class="row">
                  <div class="col-6">
                    <div class="dg-label">Municipio</div>
                    <div class="dg-small">{{ params.nombreMunicipio || '-' }}</div>
                  </div>
                  <div class="col-6">
                    <div class="dg-label">Localidad</div>
                    <div class="dg-small">{{ params.nombreLocalidad || params.nombreLocalidad || '-' }}</div>
                  </div>
                </div>

                <div class="row" style="margin-top:0.8rem;">
                  <div class="col-6">
                    <div class="dg-label">Monto Contratado</div>
                    <div class="dg-small">{{ montoContratado | currency:'MXN':'symbol':'1.2-2' }}</div>
                  </div>
                  <div class="col-6">
                    <div class="dg-label">Duración del contrato</div>
                    <div class="dg-small">{{ params.plazoContrato ? (params.plazoContrato + ' día(s)') : (params.duracionObra ? (params.duracionObra + ' día(s)') : '-') }}</div>
                  </div>
                </div>

                <div class="row" style="margin-top:0.8rem;">
                  <div class="col-6">
                    <div class="dg-label">Tipo de obra</div>
                    <div class="dg-small">{{ params.descripcionTipoObra || '-' }}</div>
                  </div>
                  <div class="col-6">
                    <div class="dg-label">No. de oficio de autorización</div>
                    <div class="dg-small">{{ params.numeroAutorizacion || '-' }}</div>
                  </div>
                </div>

                <div class="row" style="margin-top:0.8rem;">
                  <div class="col-6">
                    <div class="dg-label">No. Licitación</div>
                    <div class="dg-small">{{ params.licitacion?.numero || '-' }}</div>
                  </div>
                  <div class="col-6">
                    <div class="dg-label">Tipo de Modalidad</div>
                    <div class="dg-small">{{ params.descripcionTipoModalidad || '-' }}</div>
                  </div>
                </div>

                <div class="row" style="margin-top:0.8rem;">
                  <div class="col-6">
                    <div class="dg-label">Geolocalización</div>
                    <div class="dg-small">
                      <a *ngIf="mapLink" [href]="mapLink" target="_blank">{{ params.latitud }}, {{ params.longitud }}</a>
                      <span *ngIf="!mapLink">-</span>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="dg-label">Contratista</div>
                    <div class="dg-small">{{ params.descripcionContratista || '-' }}</div>
                  </div>
                </div>
              </div>

            

              
            </div>

            <div class="col-md-4 offset-md-1">
              <!-- <div class="dg-gauge">
                <div class="dg-label">Avance de obra</div> -->
                <!-- <div class="gauge" [style.background]="gaugeBackground">
                  <div class="gauge-inner"></div>
                </div>
                <div class="gauge-value">{{ params.porcentajeAvance ? (params.porcentajeAvance | number:'1.0-0') : 0 }}</div> -->
                <app-gauge [value]="params.porcentajeAvance"></app-gauge>
<!-- 
                <div class="gauge-sub">% completado</div>
              </div> -->

              <div style="margin-top:1.2rem;">
                <div class="row">
                  <div class="col-6">
                    <div class="dg-label">Beneficiarios</div>
                    <div class="value">{{ params.totalBeneficiados || '-' }}</div>
                    <div class="dg-small">Habitantes</div>
                  </div>
                  <div class="col-6 text-right">
                    <div class="dg-label">Avance financiero</div>
                    <div class="value">{{ params.porcentajeMonetario ? (params.porcentajeMonetario | number:'1.0-0') : 0 }}%</div>
                  </div>
                </div>

                <div style="margin-top:1.2rem;">
                  <div class="dg-label">Fecha Estimada de Inicio</div>
                  <div class="dg-small">{{ params.fechaEstimadaInicioObra ? (params.fechaEstimadaInicioObra | date:"d 'de' MMMM 'de' yyyy":'' : 'es') : (params.fechaEstimadaInicio ? (params.fechaEstimadaInicio | date:"d 'de' MMMM 'de' yyyy":'' : 'es') : '-') }}</div>
                </div>

                <div style="margin-top:0.6rem;">
                  <div class="dg-label">Fecha Estimada de Termino</div>
                  <div class="dg-small">{{ params.fechaEstimadaFinObra ? (params.fechaEstimadaFinObra | date:"d 'de' MMMM 'de' yyyy":'' : 'es') : (params.fechaEstimadaFin ? (params.fechaEstimadaFin | date:"d 'de' MMMM 'de' yyyy":'' : 'es') : '-') }}</div>
                </div>

                <div style="margin-top:0.6rem;">
                  <div class="dg-label">Supervisor</div>
                  <div class="dg-small">{{ params.nombreSupervisor || '-' }}</div>
                </div>
                  <div class="dg-row" style="margin-top:1rem;">
                <div class="dg-label">Evidencia Fotográfica</div>
                <div style="margin-top:0.5rem;">
                  <div class="dg-evidence" *ngIf="images?.length; else noImages">
                    <img *ngFor="let img of images" [src]="img.rutaPublica + img.nombre" class="thumb" />
                  </div>
                   <ng-template #noImages>
                     <div class="dg-small">No hay imágenes disponibles.</div>
                   </ng-template>
                </div>
              </div>
              </div>
            </div>
            <div class="dg-row dg-actions" style="margin-top:1rem; margin-left:1rem;">
                <a *ngIf="params.rutaArchivoProyecto" [href]="params.rutaArchivoProyecto" target="_blank" class="btn btn-md">Visualizar Proyecto</a>
                <a *ngIf="params.rutaArchivoPresupuesto" [href]="params.rutaArchivoPresupuesto" target="_blank" class="btn btn-md">Visualizar Catálogo</a>
                <a *ngIf="params.rutaArchivoContrato" [href]="params.rutaArchivoContrato" target="_blank" class="btn btn-md">Visualizar Contrato</a>
              </div>
          </div>
        </div>

        <!-- LICITACIÓN -->
        <div class="tab-pane fade" id="licitacionTab" role="tabpanel">
          <div class="row">
            <div class="col-12 mb-3">
              <strong>Número de Licitación</strong>
              <div>{{ params.licitacion?.numero || '-' }}</div>
            </div>
            <div class="col-12">
              <table class="table table-sm">
                <thead>
                  <tr>
                    <th>Evento</th>
                    <th style="text-align:right">Fecha</th>
                    <th>Documento</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let ev of params.licitacion?.eventos || []">
                    <td>{{ ev.descripcionTipoEvento }}</td>
                    <td style="text-align:right">{{ ev.fechaHora ? (ev.fechaHora | date:"d 'de' MMMM 'de' yyyy":'':'es') : '-' }}</td>
                    <td>
                      <a *ngIf="ev.rutaArchivoDocumento && ev.nombreArchivoDocumento"
                         [href]="ev.rutaArchivoDocumento + ev.nombreArchivoDocumento"
                         target="_blank" class="btn btn-sm btn-outline-gold">Documento</a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- AVANCES -->
        <div class="tab-pane fade" id="avancesTab" role="tabpanel">
          <div *ngIf="params.avances?.length; else noAvances">
            <div *ngFor="let a of params.avances" class="mb-2" style="border-bottom:1px solid #eee; padding:0.6rem 0;">
              <div class="d-flex justify-content-between">
                <div>{{ a.comentario }}</div>
                <div style="font-weight:600">{{ a.fecha ? (a.fecha | date:"d 'de' MMMM 'de' yyyy":'':'es') : '' }}</div>
              </div>
              <div class="text-muted">Porcentaje: {{ a.porcentaje | number:'1.0-0' }}%</div>
            </div>
          </div>
          <ng-template #noAvances>
            <div>No hay registros de avance.</div>
          </ng-template>
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
  public params: any = {}; // initialState.params
  public modalExtraOptions: any;
  public titlePage = 'asdf';
  public eventos: any[];
  // end

  private mensaje: Mensaje;
  private bsObraModalRef: BsModalRef;

  public montoContratado: number = 0;
  public images: Array<{ nombre: string; rutaPublica: string }> = [];
  public mapLink: string = '';
  public gaugeBackground: string = 'conic-gradient(#e0e0e0 0deg, #e0e0e0 180deg)';

  constructor(public bsLicitacionModalRef: BsModalRef, private bsModalService: BsModalService) {
    this.mensaje = new Mensaje();
    this.eventos = [];
  }

  // Angular metodos del ciclo de vida del componente
  ngOnInit(): void {
    console.log('params', this.params);
    this.eventos = this.params?.eventos ?? [];
    // monto prioritario: montoInversionContratada -> montoInversion -> montoContratado
    this.montoContratado = this.params?.montoInversionContratada ?? this.params?.montoInversion ?? this.params?.montoContratado ?? 0;
    // obtener imágenes: ultimasImagenes si existe, si no, buscar en evidencias
    if (Array.isArray(this.params?.ultimasImagenes) && this.params.ultimasImagenes.length) {
      this.images = this.params.ultimasImagenes;
    } else if (Array.isArray(this.params?.evidencias)) {
      // tomar primeras imágenes de evidencias
      const imgs = [];
      this.params.evidencias.forEach((ev: any) => {
        if (Array.isArray(ev.imagenes)) {
          ev.imagenes.slice(0,3).forEach((im: any) => imgs.push(im));
        }
      });
      this.images = imgs.slice(0,6);
    }
    // map link
    if (this.params?.latitud && this.params?.longitud) {
      this.mapLink = `https://www.google.com/maps?q=${this.params.latitud},${this.params.longitud}`;
    }
    // calcular fondo del gauge (ángulo proporcional a porcentaje: 100% -> 180deg)
    const pct = Math.max(0, Math.min(100, Number(this.params?.porcentajeAvance ?? 0)));
    const angle = pct * 1.8; // 100% -> 180deg
    // conic-gradient desde 180deg para que el arco dibuje en la parte superior (semicírculo)
    this.gaugeBackground = `conic-gradient(from 180deg, #6b1d2b ${angle}deg, #e0e0e0 ${angle}deg 180deg)`;
  }
  // ------------------------------------------------- //

  public openModalObra(opciones?: any) {
    const initialState = {
      params: opciones ? { id: opciones.idObra, licitacion: opciones } : {},
      isModal: true,
      modalExtraOptions: {
        closeButton: true,
        closeButtonText: 'Cancelar',
        acceptButton: true,
        acceptButtonText: 'Aceptar'
      }
    };

    this.bsObraModalRef = this.bsModalService.show(ObrasModalComponent, {
      initialState,
      class: 'modal-gold modal-fullscreen',
      backdrop: 'static',
      keyboard: false,
      ignoreBackdropClick: true
    });

    this.bsObraModalRef.content.event.subscribe((res) => {
      console.warn(res);
    });

    this.bsModalService.onHide.subscribe((reason: string) => {});
  }

  // Cerrar el modal, ademas envia la informacion al componente list correspondiente. No modificar
  private closeModal(data: any) {
    const response = {
      data
    };
    this.event.next(response);
    this.bsLicitacionModalRef.hide();
  }

  public close() {
    this.bsLicitacionModalRef.hide();
  }
}
