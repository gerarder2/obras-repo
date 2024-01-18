import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HelperService } from '../../../helpers/helper.service';
import { ConfigService } from '../../../services';

@Injectable({
  providedIn: 'root'
})
export class CaminosService {
  private config: any;
  private locale: any;

  constructor(private http: HttpClient, private helperService: HelperService, configService: ConfigService) {
    this.config = configService.getConfig();
  }

  public getData(queryParams?: any): Observable<any> {
    return this.http.get(`${this.config.webApiCaminos}/ProyectoCoordenadas/Listado`, { params: queryParams });
  }
}
