import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Preuzmi token iz localStorage (ili sessionStorage)
    if (req.url.endsWith('/auth/login') || req.url.endsWith('/auth/register')) {
      return next.handle(req);
    }
    const token = localStorage.getItem('accessToken');
    // Ako postoji, kloniraj zahtev i dodaj Authorization header
    if (token) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(authReq);
    }
    // Inače samo prosledi originalni zahtev
    return next.handle(req);
  }
}