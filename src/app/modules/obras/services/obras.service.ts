import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.dev';
import { HelperService } from '../../../helpers/helper.service';
import { ConfigService } from '../../../services';
import { ObraPortalReporte } from '../models/obrareporte.interface';

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

  // http://74.208.25.33:86/api/ObraPortal/4462
  public getObrasDatosById(obra: { idObra?: number }): Observable<any> {
    return this.http.get(`${this.config.webApi}/ObraPortal/${obra.idObra}`);
  }

  // public getReporte(queryParams: {
  //   idMunicipio?: number;
  //   ejercicio?: number;
  //   estatus?: string;
  //   esPlataformaAfectaciones?: boolean;
  // }): Observable<any> {
  //   queryParams.esPlataformaAfectaciones = true;
  //   return this.http.get(`${this.config.webApi}/ObraPortal/ObtenerReportePorMunicipio`, {
  //     params: queryParams,
  //     responseType: 'blob'
  //   });
  // }

  public getObrasReporte(queryParams: {
    idMunicipio?: number;
    ejercicio?: number;
    estatus?: string;
    esPlataformaAfectaciones?: boolean;
  }): Observable<any> {
    // queryParams.esPlataformaAfectaciones = true;
    // return this.http.get(`${this.config.webApi}/ObraPortal/ObtenerDatosReporteMunicipios`, { params: queryParams });
    return this.http.get(`http://localhost:5091/api/ObraPortal/ObtenerDatosReporteMunicipios`, {
      params: queryParams
    });
  }
}
