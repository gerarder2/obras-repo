import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './app-footer.component.html'
})
export class AppFooterComponent implements OnInit {
  public copyRightYear: number;
  public showSocials: boolean;
  public version: string;
  constructor() {
    this.showSocials = false;
  }

  public ngOnInit() {
    this.copyRightYear = new Date().getFullYear();
    this.version = localStorage.getItem('version');
  }
}
