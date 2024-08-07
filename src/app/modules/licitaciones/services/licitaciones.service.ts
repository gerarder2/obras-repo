import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HelperService } from '../../../helpers/helper.service';
import { ConfigService } from '../../../services';

@Injectable({
  providedIn: 'root'
})
export class LicitacionesService {
  private config: any;
  private locale: any;

  constructor(private http: HttpClient, private helperService: HelperService, configService: ConfigService) {
    this.config = configService.getConfig();
  }

  public getLicitacionDatos(queryParams: {
    numeroContrato?: number;
    idTipoObrasocial?: number;
    idMunicipio?: number;
    ejercicio?: number;
    idTipoModalidad?: number;
    idDependencia: number;
    idContratista?: number;
    idTipoContrato?: number;
  }): Observable<any> {
    return this.http.get(`${this.config.webApi}/ObraPortal/ListadoLicitaciones`, { params: queryParams });
  }

  public getLicitacionDatosById(obra: { idObra?: number }): Observable<any> {
    return this.http.get(`${this.config.webApi}/Licitacion/${obra.idObra}`);
  }
}
