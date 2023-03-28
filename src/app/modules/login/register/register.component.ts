import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster';

@Component({
  moduleId: module.id,
  selector: 'app-register',
  templateUrl: 'register.component.html'
})
export class RegisterComponent {
  @Input() config: any;
  @Output() onSave: EventEmitter<any> = new EventEmitter();

  model: any = {};
  loading = false;

  constructor(private router: Router, private toaster: ToasterService) {}

  register() {
    this.loading = true;
  }
}
