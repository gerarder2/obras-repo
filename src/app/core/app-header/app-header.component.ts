import { AuthenticationService, ConfigService, MenuService } from './../../services/index';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

import { Observable, Observer, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { Subscription } from 'rxjs';
import { Mensaje } from '../../models';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ObrasModalComponent } from '../../modules/obras/modal/obras-modal.component';
import { HelperService } from '../../helpers/helper.service';
import { ModalTarjetaInformativaComponent } from 'src/app/modules/obras/modal-tarjeta-informativa/modal-tarjeta-informativa.component';
import { ObrasService } from 'src/app/modules/obras/services/obras.service';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent implements OnInit {
  @ViewChild('typeaheadInput') typeaheadInput: ElementRef;

  @Input() public imgUrl: string;
  @Input() public appLogo: string;
  @Input() public user: any;
  @Input() public notifications: any[];
  @Input() public messages: any[];

  public trustedImgUrl: SafeUrl;
  public imgUrlError;
  public links: any;

  search?: string;
  suggestions$?: Observable<any[]>;
  errorMessage?: string;
  noResultsFound: boolean;

  // @Output() onLogout: EventEmitter<any> = new EventEmitter();

  public subscription: Subscription;
  public menuExist = false;

  private mensaje: Mensaje;
  private bsObraModalRef: BsModalRef;
  private bsModalRef: BsModalRef;

  private config: any;
  private webApi: string;

  constructor(
    private menuData: MenuService,
    private auth: AuthenticationService,
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    private bsModalService: BsModalService,
    private configService: ConfigService,
    private helperService: HelperService,
    public obrasService: ObrasService
  ) {
    this.trustedImgUrl = sanitizer.bypassSecurityTrustResourceUrl(this.imgUrl);
    this.imgUrlError = 'assets/img/avatars/user-a.png';
    this.mensaje = new Mensaje();
    this.config = this.configService.getConfig();
    this.webApi = this.config.webApi;
  }

  public logOut() {
    setTimeout(() => {
      this.auth.logout();
    }, 100);
  }

  public ngOnInit() {
    document.querySelector('body').classList.add('aside-menu-hidden');
    this.subscription = this.menuData.navItem$.subscribe(
      (value) => {
        this.menuExist = value;
      },
      (err: unknown) => {}
    );

    this.links = [
      { url: '/inicio', name: 'Inicio', class: 'px-3' },
      { url: '/licitaciones', name: 'Licitaciones', class: 'px-3' },
      { url: '/obras', name: 'Obras', class: 'px-3' },
      { url: '/datos-abiertos', name: 'Datos Abiertos', class: 'px-3' }
      //{ url: '/caminos', name: 'Mapa Carretero', class: 'px-2' }
    ];

    this.suggestions$ = new Observable((observer: Observer<string | undefined>) => {
      console.log('sear', this.search);
      observer?.next(this.search);
    }).pipe(
      switchMap((query: string) => {
        if (query) {
          return this.http
            .get(`${this.webApi}/ObraPortal/Combo`, {
              params: { filtroBusqueda: query }
            })
            .pipe(
              map((data: any) => {
                const format_data = [];
                if (data?.data.length > 0) {
                  this.noResultsFound = false;
                  data.data.forEach((element) => {
                    console.log('element', element.id);
                    const addAttr = this.helperService.getIconTipoObras(element.idTipoObraSocial);
                    element = { ...element, ...addAttr };
                    format_data.push(element);
                  });
                } else {
                  this.noResultsFound = true;
                }
                console.log('formdata', format_data);
                return (data && format_data) || [];
              })
            );
        }

        return of([]);
      })
    );
  }

  public typeaheadOnSelect($event) {
    console.log($event);
    this.openModalObra($event.item);
  }

  public openModalObra(opciones?: any) {
    const initialState = {
      params: opciones ? { id: opciones.id, licitacion: null } : {},
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
      class: 'modal-primary modal-fullscreen',
      backdrop: 'static',
      keyboard: false,
      ignoreBackdropClick: true
    });

    this.bsObraModalRef.content.event.subscribe((res) => {
      console.warn(res);
    });

    this.bsModalService.onHide.subscribe((reason: string) => {});
  }

  clearInput(): void {
    if (this.search) {
      this.typeaheadInput.nativeElement.value = '';
    }
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
}
