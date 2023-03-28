import {
  HTTP_INTERCEPTORS,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Observable, of as observableOf, throwError as observableThrowError } from 'rxjs';
import { delay, dematerialize, materialize, mergeMap } from 'rxjs/operators';

import { Injectable } from '@angular/core';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  // tslint:disable-next-line:cognitive-complexity
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // array in local storage for registered users
    const users: any[] = JSON.parse(localStorage.getItem('users')) || [];

    // wrap in delayed observable to simulate server api call
    return observableOf(null).pipe(
      mergeMap(() => {
        // authenticate
        if (request.url.endsWith('/api/authenticate') && request.method === 'POST') {
          // find if any user matches login credentials
          const filteredUsers = users.filter((user) => {
            return user.username === request.body.username && user.password === request.body.password;
          });

          if (filteredUsers.length) {
            // if login details are valid return 200 OK with user details and fake jwt token
            const user = filteredUsers[0];
            const theBody = {
              id: user.id,
              username: user.username,
              firstName: user.firstName,
              lastName: user.lastName,
              token: 'fake-jwt-token'
            };

            return observableOf(new HttpResponse({ status: 200, body: theBody }));
          } else {
            // else return 400 bad request
            return observableThrowError('Username or password is incorrect');
          }
        }

        // get users
        if (request.url.endsWith('/api/users') && request.method === 'GET') {
          // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
          if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
            return observableOf(new HttpResponse({ status: 200, body: users }));
          } else {
            // return 401 not authorised if token is null or invalid
            return observableThrowError('Unauthorised');
          }
        }

        // get user by id
        if (request.url.match(/\/api\/users\/\d+$/) && request.method === 'GET') {
          // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
          if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
            // find user by id in users array
            const urlParts = request.url.split('/');
            const id = parseInt(urlParts[urlParts.length - 1], 10);
            const matchedUsers = users.filter((_user) => {
              return _user.id === id;
            });
            const user = matchedUsers.length ? matchedUsers[0] : null;

            return observableOf(new HttpResponse({ status: 200, body: user }));
          } else {
            // return 401 not authorised if token is null or invalid
            return observableThrowError('Unauthorised');
          }
        }

        // create user
        if (request.url.endsWith('/api/users') && request.method === 'POST') {
          // get new user object from post body
          const newUser = request.body;

          // validation
          const duplicateUser = users.filter((user) => {
            return user.username === newUser.username;
          }).length;
          if (duplicateUser) {
            return observableThrowError('Username "' + newUser.username + '" is already taken');
          }

          // save new user
          newUser.id = users.length + 1;
          users.push(newUser);
          localStorage.setItem('users', JSON.stringify(users));

          // respond 200 OK
          return observableOf(new HttpResponse({ status: 200 }));
        }

        // delete user
        if (request.url.match(/\/api\/users\/\d+$/) && request.method === 'DELETE') {
          // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
          if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
            // find user by id in users array
            const urlParts = request.url.split('/');
            const id = parseInt(urlParts[urlParts.length - 1], 10);
            for (let i = 0; i < users.length; i++) {
              const user = users[i];
              if (user.id === id) {
                // delete user
                users.splice(i, 1);
                localStorage.setItem('users', JSON.stringify(users));
                break;
              }
            }

            // respond 200 OK
            return observableOf(new HttpResponse({ status: 200 }));
          } else {
            // return 401 not authorised if token is null or invalid
            return observableThrowError('Unauthorised');
          }
        }

        // pass through any requests not handled above
        return next.handle(request);
      }),

      // call materialize and dematerialize to ensure delay even if an error is thrown
      // (https://github.com/Reactive-Extensions/RxJS/issues/648)
      materialize(),
      delay(500),
      dematerialize()
    );
  }
}

export const fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true
};
