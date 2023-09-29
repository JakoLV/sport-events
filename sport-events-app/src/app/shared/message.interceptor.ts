import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { ToastService } from './services/toast.service';

@Injectable()
export class MessageInterceptor implements HttpInterceptor {

  constructor(private toastService: ToastService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap(response => {
        if (response instanceof HttpResponse && response.body) {
          const responseBody = response.body;
          if (responseBody.notifyUser && responseBody.message) {
            const messageType = responseBody.type || 'info';
            this.toastService.show(messageType, responseBody.message);
          }
        }
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.error) {
          const errorResponse = error.error;
          if (errorResponse.notifyUser && errorResponse.message) {
            const messageType = errorResponse.type || 'error';
            this.toastService.show(messageType, errorResponse.message);
          }
        }
        return throwError(error);
      })
    );
  }
}
