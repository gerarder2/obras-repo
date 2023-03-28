import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.Token) {
      request = request.clone({
        setHeaders: {
          Authorization: `${currentUser.Token}`
        }
      });
    }
    return next
      .handle(request)
      .pipe(
        tap((ev: HttpEvent<any>) => {
          if (ev instanceof HttpResponse) {
            // console.log('processing response', ev);
          }
        })
      )
      .pipe(
        catchError((response: unknown) => {
          if (response instanceof HttpErrorResponse) {
            if (response.status === 401) {
              localStorage.removeItem('currentUser');
              this.router.navigate(['/login']);
            }
          }
          return throwError(response);
        })
      );
  }
}
