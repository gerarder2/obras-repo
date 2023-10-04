import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './app-footer.component.html'
})
export class AppFooterComponent implements OnInit {
  public copyRightYear: number;
  public showSocials: boolean;
  constructor() {
    this.showSocials = false;
  }

  public ngOnInit() {
    this.copyRightYear = new Date().getFullYear();
  }
}
