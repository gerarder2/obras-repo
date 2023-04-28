import { AuthenticationService, MenuService } from './../../services/index';
import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent implements OnInit {
  @Input() public imgUrl: string;
  @Input() public appLogo: string;
  @Input() public user: any;
  @Input() public notifications: any[];
  @Input() public messages: any[];

  public trustedImgUrl: SafeUrl;
  public imgUrlError;
  public links: any;

  // @Output() onLogout: EventEmitter<any> = new EventEmitter();

  public subscription: Subscription;
  public menuExist = false;

  constructor(private menuData: MenuService, private auth: AuthenticationService, private sanitizer: DomSanitizer) {
    this.trustedImgUrl = sanitizer.bypassSecurityTrustResourceUrl(this.imgUrl);
    this.imgUrlError = 'assets/img/avatars/user-a.png';
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
  }
}
