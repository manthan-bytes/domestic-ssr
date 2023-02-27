import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthDataService } from '../authentication/auth.service';
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authDataService: AuthDataService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((err) => {
        if (err.error && err.error.statusCode === 403) {
          this.authDataService.logOut();
          return throwError(err);
        } else {
          return throwError(err);
        }
      }),
    );
  }
}
