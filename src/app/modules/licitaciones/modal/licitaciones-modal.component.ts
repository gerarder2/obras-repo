/* eslint-disable no-inline-comments */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, EventEmitter, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Mensaje } from '../../../models/mensaje';
import { ObrasModalComponent } from '../../obras/modal/obras-modal.component';

@Component({
  selector: 'app-licitaciones-modal',
  styleUrls: ['../licitaciones.component.scss'],
  template: `
    <!-- estilos movidos a ../licitaciones.component.scss -->

    <div class="modal-header" ngxModalDraggable>
      <div class="container no-cursor">
        <div class="row align-items-start">
          <div class="col-6" *ngIf="params.numeroContrato !== null">
            <small>Número de Contrato</small>
            <p style="margin-bottom:0.25rem;">{{ params.numeroContrato }}</p>
          </div>

          <div class="col-6 text-right" *ngIf="params.fechaContratacion">
            <small>Fecha de Contrato</small>
            <p style="margin-bottom:0;">
              {{ params.fechaContratacion | date: "d 'de' MMMM 'de' yyyy":'':'es' }}
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
          <a
            class="nav-link"
            href="#datosGenerales"
            (click)="$event.preventDefault(); setActiveTab('datosGenerales')"
            [class.active]="activeTab === 'datosGenerales'"
          >
            DATOS GENERALES
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            href="#licitacionTab"
            (click)="$event.preventDefault(); setActiveTab('licitacionTab')"
            [class.active]="activeTab === 'licitacionTab'"
          >
            LICITACIÓN
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            href="#avancesTab"
            (click)="$event.preventDefault(); setActiveTab('avancesTab')"
            [class.active]="activeTab === 'avancesTab'"
          >
            AVANCES
          </a>
        </li>
      </ul>

      <div class="tab-content" style="padding:0.2rem; overflow:auto;">
        <!-- DATOS GENERALES - nuevo diseño -->
        <div
          id="datosGenerales"
          role="tabpanel"
          class="tab-pane fade"
          [class.show]="activeTab === 'datosGenerales'"
          [class.active]="activeTab === 'datosGenerales'"
        >
          <div class="row">
            <div class="col-12 col-md-6">
              <div class="dg-label">Monto Total Contratado</div>
              <div class="dg-amount">$ {{ montoContratado | number: '1.2-2' }} MXN</div>
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
                    <div class="dg-small">{{ montoContratado | currency: 'MXN':'symbol':'1.2-2' }}</div>
                  </div>
                  <div class="col-6">
                    <div class="dg-label">Duración del contrato</div>
                    <div class="dg-small">
                      {{
                        params.plazoContrato
                          ? params.plazoContrato + ' día(s)'
                          : params.duracionObra
                          ? params.duracionObra + ' día(s)'
                          : '-'
                      }}
                    </div>
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
                      <a *ngIf="mapLink" [href]="mapLink" target="_blank"
                        >{{ params.latitud }}, {{ params.longitud }}</a
                      >
                      <span *ngIf="!mapLink">-</span>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="dg-label">Contratista</div>
                    <div class="dg-small">{{ params.descripcionContratista || '-' }}</div>
                  </div>
                </div>
                <div class="dg-row dg-actions" style="margin-top:4rem; margin-left:1rem;">
                  <a
                    *ngIf="params.rutaArchivoProyecto"
                    [href]="params.rutaArchivoProyecto"
                    target="_blank"
                    class="btn btn-md"
                    >Visualizar Proyecto</a
                  >
                  <a
                    *ngIf="params.rutaArchivoPresupuesto"
                    [href]="params.rutaArchivoPresupuesto"
                    target="_blank"
                    class="btn btn-md"
                    >Visualizar Catálogo</a
                  >
                  <a
                    *ngIf="params.rutaArchivoContrato"
                    [href]="params.rutaArchivoContrato"
                    target="_blank"
                    class="btn btn-md"
                    >Visualizar Contrato</a
                  >
                </div>
              </div>
            </div>

            <div class="col-12 col-md-6">
              <div class="stats-row">
                <!-- Gauge: en mobile ocupará toda la fila -->
                <div class="gauge-col">
                  <div class="gauge-wrapper small-gauge">
                    <app-gauge [value]="params.porcentajeAvance"></app-gauge>
                  </div>
                </div>

                <!-- Beneficiarios -->
                <div class="stat-col text-center">
                  <div class="dg-label">Beneficiarios</div>
                  <div class="value" style="font-size:1.6rem; font-weight:700; color:#6b1d2b;">
                    {{ params.totalBeneficiados !== null ? (params.totalBeneficiados | number: '1.0-0') : '-' }}
                  </div>
                  <div class="dg-label">Habitantes</div>
                </div>

                <!-- Avance financiero -->
                <div class="stat-col text-center">
                  <div class="dg-label">Avance financiero</div>
                  <div class="value" style="font-size:1.6rem; font-weight:700; color:#6b1d2b;">
                    {{ params.porcentajeMonetario ? (params.porcentajeMonetario | number: '1.0-0') : 0 }} %
                  </div>
                </div>
              </div>

              <!-- datos adicionales debajo (fechas, supervisor, evidencia) -->

              <div style="margin-top:4.2rem;">
                <!-- fechas y supervisor: grid 2 columnas -->
                <div class="date-grid" style="margin-top:1.2rem;">
                  <div class="date-item">
                    <div class="dg-label">Fecha Estimada de Inicio</div>
                    <div class="dg-small">
                      {{
                        params.fechaEstimadaInicioObra
                          ? (params.fechaEstimadaInicioObra | date: "d 'de' MMMM 'de' yyyy":'':'es')
                          : params.fechaEstimadaInicio
                          ? (params.fechaEstimadaInicio | date: "d 'de' MMMM 'de' yyyy":'':'es')
                          : '-'
                      }}
                    </div>
                  </div>

                  <div class="date-item">
                    <div class="dg-label">Fecha Estimada de Termino</div>
                    <div class="dg-small">
                      {{
                        params.fechaEstimadaFinObra
                          ? (params.fechaEstimadaFinObra | date: "d 'de' MMMM 'de' yyyy":'':'es')
                          : params.fechaEstimadaFin
                          ? (params.fechaEstimadaFin | date: "d 'de' MMMM 'de' yyyy":'':'es')
                          : '-'
                      }}
                    </div>
                  </div>

                  <div class="date-item">
                    <div class="dg-label">Fecha Real de Inicio</div>
                    <div class="dg-small">{{ params.fechaInicio || '-' }}</div>
                  </div>

                  <div class="date-item">
                    <div class="dg-label">Fecha Real de Termino</div>
                    <div class="dg-small">{{ params.fechaFinalizacion || '-' }}</div>
                  </div>

                  <div class="date-item">
                    <div class="dg-label">Organismo</div>
                    <div class="dg-small">{{ params.descripcionDependencia || '-' }}</div>
                  </div>

                  <div class="date-item">
                    <div class="dg-label">Supervisor</div>
                    <div class="dg-small">{{ params.nombreSupervisor || '-' }}</div>
                  </div>
                </div>

                <div class="dg-row" style="margin-top:1rem;">
                  <div class="dg-label">Evidencia Fotográfica</div>
                  <div style="margin-top:0.5rem;">
                    <div class="dg-evidence" *ngIf="images?.length; else noImages">
                      <img
                        *ngFor="let img of images"
                        [src]="img.rutaPublica + img.nombre"
                        class="thumb clickable"
                        (click)="openImage(img)"
                      />
                    </div>
                    <ng-template #noImages>
                      <div class="dg-small">No hay imágenes disponibles.</div>
                    </ng-template>
                  </div>
                </div>

                <!-- Lightbox / imagen ampliada -->
                <div *ngIf="selectedImage" class="image-lightbox" (click)="closeImage()">
                  <div class="lightbox-content" (click)="$event.stopPropagation()">
                    <button class="lightbox-close" (click)="closeImage()"><i class="fa fa-close"></i></button>
                    <img [src]="selectedImage.rutaPublica + selectedImage.nombre" class="lightbox-img" />
                  </div>
                </div>
              </div>
            </div>

            <!-- AVANCES -->
          </div>
        </div>
        <div
          id="avancesTab"
          role="tabpanel"
          class="tab-pane fade"
          [class.show]="activeTab === 'avancesTab'"
          [class.active]="activeTab === 'avancesTab'"
        >
          <div *ngIf="params.avances?.length; else noAvances">
            <div *ngFor="let a of params.avances" class="mb-2" style="border-bottom:1px solid #eee; padding:0.6rem 0;">
              <div class="d-flex justify-content-between">
                <div>{{ a.comentario }}</div>
                <div style="font-weight:600">
                  {{ a.fecha ? (a.fecha | date: "d 'de' MMMM 'de' yyyy":'':'es') : '' }}
                </div>
              </div>
              <div class="text-muted">Porcentaje: {{ a.porcentaje | number: '1.0-0' }}%</div>
            </div>
          </div>
          <ng-template #noAvances>
            <div>No hay registros de avance.</div>
          </ng-template>
        </div>
        <!-- LICITACIÓN: renderizar sólo cuando está activo para evitar problemas de display -->
        <div
          id="licitacionTab"
          role="tabpanel"
          class="tab-pane"
          *ngIf="activeTab === 'licitacionTab'"
          [style.display]="activeTab === 'licitacionTab' ? 'block' : 'none'"
        >
          <div class="row">
            <div class="col-12 mb-3">
              <strong>Objeto</strong>
              <div>{{ params.objeto || '-' }}</div>
            </div>

            <div class="col-12">
              <div class="row">
                <div class="col-6 col-md-3 mb-3">
                  <div class="p-2 h-100 bg-white">
                    <div class="dg-label">Municipio</div>
                    <div class="text-muted">{{ params.nombreMunicipio || '-' }}</div>
                  </div>
                </div>

                <div class="col-6 col-md-3 mb-3">
                  <div class="p-2 h-100 bg-white">
                    <div class="dg-label">Localidad</div>
                    <div class="text-muted">{{ params.nombreLocalidad || '-' }}</div>
                  </div>
                </div>

                <div class="col-6 col-md-3 mb-3">
                  <div class="p-2 h-100 bg-white">
                    <div class="dg-label">Presupuesto Base</div>
                    <div class="text-muted">
                      $ {{ params.montoInversion !== null ? (params.montoInversion | number: '1.2-2') : '-' }} MXN
                    </div>
                  </div>
                </div>

                <div class="col-6 col-md-3 mb-3">
                  <div class="p-2 h-100 bg-white">
                    <div class="dg-label">Número de Licitación</div>
                    <div class="text-muted">{{ params.licitacion?.numero || '-' }}</div>
                  </div>
                </div>

                <div class="col-6 col-md-3 mb-3">
                  <div class="p-2 h-100 bg-white">
                    <div class="dg-label">Convocatoria</div>
                    <div class="text-muted">{{ params.licitacion?.fechaPublicacion || '-' }}</div>
                  </div>
                </div>

                <div class="col-6 col-md-3 mb-3">
                  <div class="p-2 h-100 bg-white">
                    <div class="dg-label">Fecha Limite para Adquirir Bases</div>
                    <div class="text-muted">{{ params.fechaBases || '-' }}</div>
                  </div>
                </div>

                <div class="col-6 col-md-3 mb-3">
                  <div class="p-2 h-100 bg-white">
                    <div class="dg-label">Visita en el Lugar de Obra</div>
                    <div class="text-muted">{{ params.fechaVisitaObra || '-' }}</div>
                  </div>
                </div>

                <div class="col-6 col-md-3 mb-3">
                  <div class="p-2 h-100 bg-white">
                    <div class="dg-label">Junta de Aclaraciónes</div>
                    <div class="text-muted">{{ params.fechaJuntaAclaraciones || '-' }}</div>
                  </div>
                </div>

                <div class="col-6 col-md-3 mb-3">
                  <div class="p-2 h-100 bg-white">
                    <div class="dg-label">Presentación y Apertura de Propuestas Tecnicas-Economicas</div>
                    <div class="text-muted">{{ params.fechaAperturaTecnica || '-' }}</div>
                  </div>
                </div>

                <div class="col-6 col-md-3 mb-3">
                  <div class="p-2 h-100 bg-white">
                    <div class="dg-label">Fecha para dar a Conocer Fallo</div>
                    <div class="text-muted">{{ params.fechaFallo || '-' }}</div>
                  </div>
                </div>

                <div class="col-6 col-md-3 mb-3">
                  <div class="p-2 h-100 bg-white">
                    <div class="dg-label">Fecha Estimada de Inicio de Obra</div>
                    <div class="text-muted">{{ params.fechaEstimadaInicioObra || '-' }}</div>
                  </div>
                </div>

                <div class="col-6 col-md-3 mb-3">
                  <div class="p-2 h-100 bg-white">
                    <div class="dg-label">Fecha Estimada de Termino de Obra</div>
                    <div class="text-muted">{{ params.fechaEstimadaFinObra || '-' }}</div>
                  </div>
                </div>
                <div class="col-6 col-md-3 mb-3">
                  <div class="p-2 h-100 bg-white">
                    <div class="dg-label">Duración de Obra</div>
                    <div class="text-muted">
                      {{ params.duracionObra !== null ? params.duracionObra + ' día(s)' : '-' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- después de las tarjetas de licitación, añadir la tabla de eventos -->
            <div class="col-12 mt-3">
              <ng-container *ngIf="licitacionEventos?.length; else noLicitacionEvents">
                <table class="table table-sm">
                  <thead>
                    <tr>
                      <th class="backgroud-gray">Evento</th>
                      <th class="backgroud-gray" style="text-align:left">Fecha</th>
                      <th class="backgroud-gray">Documento</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let ev of licitacionEventos" style="height: 55px;">
                      <td>{{ ev.descripcionTipoEvento || '-' }}</td>
                      <td style="text-align:left">
                        {{ ev.fechaHora ? (ev.fechaHora | date: "d 'de' MMMM 'de' yyyy":'':'es') : '-' }}
                      </td>
                      <td>
                        <a
                          *ngIf="ev.rutaArchivoDocumento && ev.nombreArchivoDocumento"
                          [href]="ev.rutaArchivoDocumento + ev.nombreArchivoDocumento"
                          target="_blank"
                          class="btn btn-sm btn-tinto"
                          role="button"
                        >
                          <i class="fa fa-file-download" aria-hidden="true" style="margin-right:0.4rem"></i>
                          Documento
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </ng-container>

              <ng-template #noLicitacionEvents>
                <div class="p-2 text-muted">No hay eventos de licitación.</div>
              </ng-template>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LicitacionesModalComponent implements OnInit {
  public activeTab: 'datosGenerales' | 'licitacionTab' | 'avancesTab' = 'licitacionTab';

  // public setActiveTab(tab: 'datosGenerales' | 'licitacionTab' | 'avancesTab') {
  //   this.activeTab = tab;
  // }

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

  // lightbox
  public selectedImage: { nombre: string; rutaPublica: string } | null = null;

  // ------------------------------------------------- //

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
    this.montoContratado =
      this.params?.montoInversionContratada ?? this.params?.montoInversion ?? this.params?.montoContratado ?? 0;
    // obtener imágenes: ultimasImagenes si existe, si no, buscar en evidencias
    if (Array.isArray(this.params?.ultimasImagenes) && this.params.ultimasImagenes.length) {
      this.images = this.params.ultimasImagenes;
    } else if (Array.isArray(this.params?.evidencias)) {
      // tomar primeras imágenes de evidencias
      const imgs = [];
      this.params.evidencias.forEach((ev: any) => {
        if (Array.isArray(ev.imagenes)) {
          ev.imagenes.slice(0, 3).forEach((im: any) => imgs.push(im));
        }
      });
      this.images = imgs.slice(0, 6);
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

  public openImage(img: { nombre: string; rutaPublica: string }) {
    this.selectedImage = img;
  }

  public closeImage() {
    this.selectedImage = null;
  }

  // Devuelve la lista de eventos buscando en varios sitios posibles
  public get licitacionEventos(): any[] {
    // prioridad: params.licitacion.eventos -> params.eventos -> this.eventos -> []
    return this.params?.licitacion?.eventos ?? this.params?.eventos ?? this.eventos ?? [];
  }

  // opcional: ver qué trae params cuando cambias a la pestaña
  public setActiveTab(tab: 'datosGenerales' | 'licitacionTab' | 'avancesTab') {
    this.activeTab = tab;
    console.log('activeTab ->', tab, 'licitacionEventos ->', this.licitacionEventos);
  }
}
