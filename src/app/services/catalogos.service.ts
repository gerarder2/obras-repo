import { Observable, forkJoin } from 'rxjs';

import { HelperService } from './../helpers/helper.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { environment } from './../../environments/environment';
import { map } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class CatalogosService {
  public config: any;
  public geoJson: any;
  private locale: any;
  private webApi: string;
  private webApiMaatCore: string;

  constructor(
    private http: HttpClient,
    private helperService: HelperService,
    configService: ConfigService,
    private auth: AuthenticationService
  ) {
    this.config = configService.getConfig();
    this.webApi = this.config.webApi;
    this.webApiMaatCore = this.config.webApiMaatCore;
  }

  public getCatalogos() {
    const obrasSocial = `${this.webApi}/TipoObraSocial/Filtro`;
    const tiposModalidad = `${this.webApi}/TipoModalidad/Combo`;
    const organismos = `${this.webApiMaatCore}/Dependencia/Combo?IdAgrupador=${this.config.idAgrupador}`;
    const constratistas = `${this.webApi}/Contratista/Combo?IdUsuario=${this.auth.currentUser().id}`;
    const tiposContrato = `${this.webApi}/TipoContrato/Combo`;
    const dependencias = `${this.webApi}/ObraPortal/ComboDependencias?IdUsuario=${this.auth.currentUser().id}`;
    const distritos = `${this.webApiMaatCore}/Distrito/Combo`;

    //74.208.25.33:8083/api/Distrito/Combo

    return forkJoin([
      this.http.get(obrasSocial),
      this.http.get(tiposModalidad),
      this.http.get(organismos),
      this.http.get(constratistas),
      this.http.get(tiposContrato),
      this.http.get(dependencias),
      this.http.get(distritos)
    ]);
  }

  public getDistritos(queryParams: any): Observable<any> {
    return this.http.get(`${this.webApiMaatCore}/Menu/Distritos`, { params: queryParams });
  }

  public getSecciones(queryParams: any): Observable<any> {
    return this.http.get(`${this.webApiMaatCore}/Menu/Secciones`, { params: queryParams });
  }

  public getElecciones(queryParams: { idPuesto: number; anio: number; idMunicipio?: number }): Observable<any> {
    return this.http.get(`${this.webApiMaatCore}/Menu/Elecciones`, { params: queryParams });
  }

  public getObras(tiposObra: any[], queryParams?: any) {
    return this.http.get(`${this.webApi}/Obras/Obras`, { params: queryParams }).pipe(
      map((response: any) => {
        let totalObras = 0;
        let costos = 0;
        if (response.data !== null && response.data?.length > 0) {
          for (const element of response.data) {
            costos += parseFloat(element.montoInversion);
          }
          totalObras = response.data.length;

          const grupoTiposObra =
            this.helperService.getMontosPorTiposObra(queryParams.idsTiposObra, tiposObra, response.data) || [];

          for (const obra of grupoTiposObra) {
            switch (obra['id']) {
              case 1:
                obra['icon'] = 'fas fa-bolt';
                break;
              case 2:
                obra['icon'] = 'fas fa-arrow-up-from-ground-water';
                break;
              case 3:
                obra['icon'] = 'fas fa-road';
                break;
              case 4:
                obra['icon'] = 'fas fa-faucet-drip';
                break;
              case 5:
                obra['icon'] = 'fas fa-snowplow';
                break;
              case 6:
                obra['icon'] = 'fas fa-bridge';
                break;
              case 7:
                obra['icon'] = 'fas fa-arrow-up-from-water-pump';
                break;
              case 8:
                obra['icon'] = 'fas fa-compass-drafting';
                break;
              case 9:
                obra['icon'] = 'fas fa-helmet-safety';
                break;
              case 10:
                obra['icon'] = 'fas fa-broom';
                break;
              case 11:
                obra['icon'] = 'fas fa-graduation-cap';
                break;
            }
          }

          return { totalObras: totalObras, montoTotalInversion: costos, data: response.data, grupoTiposObra };
        } else {
          return response;
        }
      })
    );
  }

  public getObrasTiposObra() {
    return this.http.get(`${this.webApi}/Obras/TiposObra`).pipe(
      map((response: any) => {
        for (const element of response.data) {
          switch (element.id) {
            case 1:
              element.icon = 'fas fa-landmark';
              break;
            case 2:
              element.icon = 'fas fa-city';
              break;
            case 3:
              element.icon = ' fas fa-bus';
              break;
            case 4:
              element.icon = 'fas fa-hand-holding-droplet';
              break;
            case 5:
              element.icon = 'fas fa-handshake-angle';
              break;
            case 6:
              element.icon = 'fas fa-bridge-water';
              break;
          }
          if (element.tiposObra.length > 0) {
            for (const obra of element.tiposObra) {
              switch (obra.id) {
                case 1:
                  obra.icon = 'fas fa-bolt';
                  break;
                case 2:
                  obra.icon = 'fas fa-arrow-up-from-ground-water';
                  break;
                case 3:
                  obra.icon = 'fas fa-road';
                  break;
                case 4:
                  obra.icon = 'fas fa-faucet-drip';
                  break;
                case 5:
                  obra.icon = 'fas fa-snowplow';
                  break;
                case 6:
                  obra.icon = 'fas fa-bridge';
                  break;
                case 7:
                  obra.icon = 'fas fa-arrow-up-from-water-pump';
                  break;
                case 8:
                  obra.icon = 'fas fa-compass-drafting';
                  break;
                case 9:
                  obra.icon = 'fas fa-helmet-safety';
                  break;
                case 10:
                  obra.icon = 'fas fa-broom';
                  break;
                case 11:
                  obra.icon = 'fas fa-graduation-cap';
                  break;
              }
            }
          }
        }
        const nodes = this.mapNodes(response.data);
        return nodes;
      })
    );
  }

  public getEleccionesSeccionesPorDistrito(queryParams: {
    idPuesto: number;
    anio: number;
    idDistrito?: number;
  }): Observable<any> {
    return this.http.get(`${this.webApiMaatCore}/Menu/EleccionesSecciones`, { params: queryParams });
  }

  private mapNodes(nodes: any[]): TreeNode[] {
    return nodes.map((node) => {
      const treeNode: TreeNode = {
        label: node.descripcion,
        children: node.tiposObra ? this.mapNodes(node.tiposObra) : null,
        data: node,
        icon: node.icon
      };
      return treeNode;
    });
  }

  public getSeccionesEspeciales(queryParams: { anio: number; puesto: number }): Observable<any> {
    return this.http.get(`${this.webApiMaatCore}/Menu/SeccionesEspeciales`, { params: queryParams });
  }

  public getEleccionesSeccionesEspeciales(queryParams: {
    idPuesto: number;
    anio: number;
    idDistrito?: number;
    idsSeccionesEspeciales: string;
  }): Observable<any> {
    return this.http.get(`${this.webApiMaatCore}/Menu/EleccionesSecciones`, { params: queryParams });
  }

  public getMapaObras(queryParams?: {
    idDependencia?: number;
    idTipoObraSocial: number;
    idMunicipio: number;
    ejercicio: number;
    estatus?: string;
    idUsuario?: number;
  }): Observable<any> {
    // queryParams.estatus = 'TODAS';
    queryParams.idUsuario = this.auth.currentUser().id;
    return this.http.get(`${this.webApi}/ObraPortal/Mapa`, { params: queryParams });
  }

  public getObrasTotales(queryParams?: any): Observable<any> {
    return this.http.get(`${this.webApi}/ObraPortal/Totales`, { params: queryParams });
  }
}
