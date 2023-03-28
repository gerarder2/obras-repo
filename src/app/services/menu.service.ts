import { BehaviorSubject, Observable } from 'rxjs';

import { ConfigService } from './config.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable()
export class MenuService {
  public apiRoot: string;
  public menuExist = new BehaviorSubject(false);

  public navItem$ = this.menuExist.asObservable();

  constructor(public http: HttpClient, private configService: ConfigService) {
    this.apiRoot = './assets/menu.json';
  }

  public getMenuBackend(queryParams?: any): Observable<any> {
    if (this.configService.config.apiMenu) {
      this.apiRoot = this.configService.config.apiMenu;
    }
    return this.http.get(this.apiRoot, { params: queryParams }).pipe(
      map((resp: any) => {
        return resp.data.menu;
      })
    );
  }

  public getMenu(): Observable<any> {
    return this.http.get(this.apiRoot);
  }

  public setExistMenu(value: boolean) {
    this.menuExist.next(value);
  }
}
