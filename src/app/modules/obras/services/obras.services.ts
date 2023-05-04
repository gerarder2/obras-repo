import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.dev';
import { HelperService } from '../../../helpers/helper.service';
import { ConfigService } from '../../../services';

@Injectable({
  providedIn: 'root'
})
export class ObrasService {
  private config: any;
  private locale: any;

  constructor(private http: HttpClient, private helperService: HelperService, configService: ConfigService) {
    this.config = configService.getConfig();
  }

  public getObrasDatos(queryParams: {
    numeroContrato?: number;
    idTipoObrasocial?: number;
    idMunicipio?: number;
    ejercicio?: number;
    idTipoModalidad?: number;
    idDependencia: number;
    idContratista?: number;
    idTipoContrato?: number;
  }): Observable<any> {
    return this.http.get(`${this.config.webApi}/ObraPortal/Listado`, { params: queryParams });
  }
}
