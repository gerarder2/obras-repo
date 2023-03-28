import { Component, Input, OnInit } from '@angular/core';

import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

@Component({
  selector: 'app-card-information',
  templateUrl: './card-information.component.html',
  styleUrls: ['./card-information.component.scss']
})
export class CardInformationComponent implements OnInit {
  @Input() properties?: any;
  @Input() tipoCard?: string = 'partido';

  public config: PerfectScrollbarConfigInterface = {};

  constructor() {}

  ngOnInit(): void {
    console.warn();
  }
}
