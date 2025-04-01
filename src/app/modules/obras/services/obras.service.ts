import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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

  // http://74.208.112.87:86/api/ObraPortal/4462
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
    idDependencia?: number;
    ejercicio?: number;
    estatus?: string;
    esPlataformaAfectaciones?: boolean;
  }): Observable<any> {
    return this.http.get(`${this.config.webApi}/ObraPortal/ObtenerDatosReporteMunicipios`, { params: queryParams });
  }

  public descargarReportePorMunicipio(queryParams: {
    idMunicipio?: number;
    idDependencia?: number;
    ejercicio?: number;
    estatus?: string;
    esPlataformaAfectaciones?: boolean;
  }): Observable<any> {
    return this.http.get(`${this.config.webApi}/ObraPortal/DescargarReportePorMunicipio`, {
      params: queryParams,
      responseType: 'blob' as 'json'
    });
  }

  public getTarjetaInformativa(queryParams: any) {
    return this.http.get(`${this.config.webApi}/ObraTarjetaInformativa/?IdObras=${queryParams.id}`);
    // return this.http.get(`${this.config.webApi}/ObraTarjetaInformativa/?IdObras=832`);
  }
}
