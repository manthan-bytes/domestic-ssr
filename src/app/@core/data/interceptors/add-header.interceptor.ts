import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from '../../utils/local-storage.service';
import { TransferState } from '@angular/platform-browser';

@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {
  constructor(private localStorageService: LocalStorageService,  private transferState: TransferState,
    @Inject(PLATFORM_ID) private platformId: any,) {}

  intercept(request: HttpRequest<unknown | unknown[]>, next: HttpHandler): Observable<HttpEvent<unknown | unknown[]>> {
    if (this.localStorageService.getToken() && !request.url.includes(environment.CMS_API)) {
      request = request.clone({
        headers: request.headers.set('Authorization', `${this.localStorageService.getToken()}`),
      });
    }

    return next.handle(request);
  }
}
