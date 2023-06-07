import { AuthenticationService, MenuService } from './../../services/index';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

import { noop, Observable, Observer, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { Subscription } from 'rxjs';
import { environment } from '../../../environments/environment.dev';
import { Mensaje } from '../../models';

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

  // @Output() onLogout: EventEmitter<any> = new EventEmitter();

  public subscription: Subscription;
  public menuExist = false;

  private mensaje: Mensaje;

  constructor(
    private menuData: MenuService,
    private auth: AuthenticationService,
    private sanitizer: DomSanitizer,
    private http: HttpClient
  ) {
    this.trustedImgUrl = sanitizer.bypassSecurityTrustResourceUrl(this.imgUrl);
    this.imgUrlError = 'assets/img/avatars/user-a.png';
    this.mensaje = new Mensaje();
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
      { url: '/inicio', name: 'Inicio' },
      { url: '/licitaciones', name: 'Licitaciones' },
      { url: '/obras', name: 'Obras' },
      { url: '/datos-abiertos', name: 'Datos Abiertos' }
    ];

    this.suggestions$ = new Observable((observer: Observer<string | undefined>) => {
      observer.next(this.search);
    }).pipe(
      switchMap((query: string) => {
        if (query) {
          // using github public api to get users by name
          // http://74.208.25.33:86/api/ObraPortal/Combo?filtroBusqueda
          return (
            this.http
              //.get('https://api.github.com/search/users', {
              .get(`${environment.webApi}/ObraPortal/Combo`, {
                params: { filtroBusqueda: query }
              })
              .pipe(map((data: any) => (data && data.data) || ['No Result Found']))
          );
        }

        return of([]);
      })
    );
  }

  public typeaheadOnSelect($event) {
    console.log($event);
  }

  clearInput(): void {
    if (this.search) {
      this.typeaheadInput.nativeElement.value = '';
    }
  }
}
