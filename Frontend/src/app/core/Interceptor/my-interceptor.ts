import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import { NavController } from '@ionic/angular';
import { BaseService } from '../Services/base.service';

@Injectable()
export class AppInterceptor implements HttpInterceptor {

    constructor(private nav: NavController, private base: BaseService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        this.base.userData.subscribe(data => {
            console.log(data);
            let token = localStorage.getItem('myToken');
            if (token) {
                const headers = new HttpHeaders({
                    'token': token,
                    'user_id': data.id
                });
                req = req.clone({ headers });
            }
        });


        return next.handle(req).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {

                }
                return event;
            }),
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    localStorage.removeItem('myToken');
                    this.nav.navigateRoot('login');
                }
                return throwError(error);
            }));
    }
}