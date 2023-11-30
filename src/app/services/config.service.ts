import { Observable, forkJoin } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  public config: any;
  public geoJson: any;
  private locale: any;

  constructor(private http: HttpClient) {}

  public getJSON() {
    return new Promise<void>((resolve) => {
      this.http.get('./assets/settings.json').subscribe((cnfg: any) => {
        this.config = cnfg;
        resolve();
      });
    });
  }

  public getConfig(): any {
    return this.config;
  }

  public getIdiomaAgGrid(): Observable<any> {
    return this.http.get('./assets/agGrid.locale.json');
  }

  public getGEOJson() {
    return forkJoin([
      this.http.get(`./assets/markers/sinaloa_municipios_min.json`),
      this.http.get(`./assets/markers/sinaloa_municipios_puntos.json`),
      this.http.get(`./assets/markers/sinaloa_distritos_min.json`),
      this.http.get(`./assets/markers/sinaloa_distritos_puntos.json`),
      this.http.get(`./assets/markers/secciones.json`)
      // this.http.get(`./assets/markers/vialidades.geojson`)
    ]);
  }
}
