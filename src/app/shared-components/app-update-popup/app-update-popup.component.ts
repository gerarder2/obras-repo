import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConfigService } from 'src/app/services/config.service';
import { ValidaVersionService } from 'src/app/services/valida-version.service';

@Component({
  selector: 'app-app-update-popup',
  templateUrl: './app-update-popup.component.html',
  styleUrls: ['./app-update-popup.component.scss']
})
export class AppUpdatePopupComponent implements OnInit {
  showPopup = false;
  showAlert = false;
  loggeado = false;
  public subscription: Subscription;
  public subscriptionVersion: Subscription;
  public subscriptionShowPopUp: Subscription;
  public subscriptionvalidaLogin: Subscription;

  constructor(private validaVersion: ValidaVersionService, private configService: ConfigService) {}

  ngOnInit(): void {
    this.validaVersion.ActivaService();

    this.subscription = this.validaVersion.showAlertaObservable$.subscribe((value) => {
      this.showAlert = value;
    });

    this.subscriptionShowPopUp = this.validaVersion.showPopUpObservable$.subscribe((value) => {
      this.showPopup = value;
    });

    this.subscriptionvalidaLogin = this.validaVersion.validaLoginObservable$.subscribe((value) => {
      this.loggeado = value;
    });
  }

  reloadPage() {
    this.subscriptionVersion = this.validaVersion.versionApiObservable$.subscribe((value) => {
      localStorage.setItem('version', value);
    });
    new HttpHeaders().set('Cache-Control', 'no-cache').set('Pragma', 'no-cache');
    window.location.reload();
  }

  closeAlerta() {
    this.showAlert = false;
    this.validaVersion.setShowAlerta(false);
    this.validaVersion.setEnableEndPoint(false);
  }

  closePopup() {
    this.showPopup = false;
    this.validaVersion.setShowPopUp(false);
  }
}
