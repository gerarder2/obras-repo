import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LicitacionesService {
  private baseUrl = 'https://apisobrasportal.sinaloa.gob.mx/api'; // ajustar si ya tienes otra base

  constructor(private http: HttpClient) {}

  public getLicitacionDatos(queryParams: {
    numeroContrato?: number;
    idTipoObrasocial?: number;
    idMunicipio?: number;
    ejercicio?: number;
    idTipoModalidad?: number;
    idDependencia: number;
    idContratista?: number;
    idTipoContrato?: number;
    idEtiqueta?: number;
  }): Observable<any> {
    return this.http.get(`${this.baseUrl}/ObraPortal/ListadoLicitacionesPorEtiqueta`, { params: queryParams });
  }

  public getLicitacionDatosById(obra: { idObra?: number }): Observable<any> {
    return this.http.get(`${this.baseUrl}/Licitacion/${obra.idObra}`);
  }

  public getProyecto(id: number) {
    return this.http.get(`${this.baseUrl}/ObraPortal/Proyecto/${id}`);
  }
}
