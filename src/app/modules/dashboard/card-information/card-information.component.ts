import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { ObrasModalComponent } from '../../obras/modal/obras-modal.component';
import { Evidencia } from '../models/evidencia.interface';
import { Imagen } from '../models/imagen.interface';

@Component({
  selector: 'app-card-information',
  templateUrl: './card-information.component.html',
  styleUrls: ['./card-information.component.scss']
})
export class CardInformationComponent implements OnInit, OnChanges {
  @Input() properties?: any;
  @Input() marker?: any;
  @Input() tipoCard?: string = 'partido';

  bsModalRef: BsModalRef;

  public config: PerfectScrollbarConfigInterface = {};

  public evidencia: Evidencia;

  //Layout
  public showCarousel: boolean;
  public imageIndex: number;

  //Gallery
  public responsiveOptions: any[];
  public displayCustom: boolean;
  public activeIndex: number;
  public images: any[];

  constructor(private bsModalService: BsModalService) {
    this.showCarousel = false;
    this.imageIndex = 0;
    this.activeIndex = 0;
    this.displayCustom = false;
    this.images = [];

    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 5
      },
      {
        breakpoint: '768px',
        numVisible: 3
      },
      {
        breakpoint: '560px',
        numVisible: 1
      }
    ];
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnChanges() {
    if (this.properties?.avances) {
      if (this.properties.avances.length > 0) {
        this.properties.porcentajeAvance = this.properties.avances[this.properties.avances.length - 1].porcentaje;
      } else {
        this.properties.porcentajeAvances = 0;
      }
    }
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {}

  public closePopup() {
    this.marker.closePopup();
    this.openModalComponent(this.properties);
  }

  // SECCION CONFIGURACION MODAL
  public openModalComponent(opciones?: any) {
    const initialState = {
      params: opciones ? opciones : {},
      isModal: true,
      modalExtraOptions: {
        closeButton: true,
        closeButtonText: 'Cancelar',
        acceptButton: true,
        acceptButtonText: 'Aceptar'
      }
    };

    this.bsModalRef = this.bsModalService.show(ObrasModalComponent, {
      initialState,
      class: 'modal-light modal-fullscreen',
      backdrop: 'static',
      keyboard: true,
      ignoreBackdropClick: true
    });

    this.bsModalRef.content.event.subscribe((res) => {
      console.warn(res);
    });

    this.bsModalService.onHide.subscribe((reason: string) => {});
  }

  openGoogleMaps(): string {
    let url = '';
    if (this.properties) {
      url = `https://www.google.com/maps?q=${this.properties.latitud},${this.properties.longitud}&ll=${this.properties.latitud},${this.properties.longitud}&z=10`;
      return url;
    }
    return '';
    //window.open(url, '_blank');
  }

  public onImageSelected(evidencia: Evidencia, index) {
    this.evidencia = evidencia;
    this.images = this.formatImages(evidencia.imagenes);
    // this.showCarousel = true;
    this.imageIndex = index;
    this.activeIndex = index;
    this.displayCustom = true;
  }

  private formatImages(images: Imagen[]) {
    const imgs = [];
    images.forEach((element, index) => {
      imgs.push({
        previewImageSrc: `${element.rutaPublica}${element.nombre}`,
        thumbnailImageSrc: `${element.rutaPublica}${element.nombre}`,
        alt: '',
        title: `Imagen - ${index + 1}`
      });
    });
    return imgs;
  }
}
