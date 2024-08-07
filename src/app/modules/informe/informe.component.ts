import { Component, OnInit } from '@angular/core';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-informe',
  templateUrl: './informe.component.html',
  styleUrls: ['./informe.component.scss']
})
export class InformeComponent {
  // iframeUrl = 'https://lookerstudio.google.com/reporting/5b1daa59-7109-467d-a596-03073dd3eb6b';
  iframeUrl = 'https://lookerstudio.google.com/embed/reporting/5b1daa59-7109-467d-a596-03073dd3eb6b/page/p_6g305crrbd';

  sanitizedIframeUrl: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {
    // Sanitiza la URL antes de asignarla
    this.sanitizedIframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.iframeUrl);
  }
}
