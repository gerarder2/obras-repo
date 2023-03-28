import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './app-footer.component.html'
})
export class AppFooterComponent implements OnInit {
  public copyRightYear: number;
  constructor() {}

  public ngOnInit() {
    this.copyRightYear = new Date().getFullYear();
  }
}
