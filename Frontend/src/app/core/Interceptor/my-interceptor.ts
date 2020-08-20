import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import { NavController, LoadingController } from '@ionic/angular';
import { BaseService } from '../Services/base.service';

@Injectable()
export class AppInterceptor implements HttpInterceptor {

    constructor(private nav: NavController, private base: BaseService,
        private load: LoadingController) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const user = JSON.parse(localStorage.getItem('myUser'));
        let token = localStorage.getItem('myToken');
        if (token && user) {
            const headers = new HttpHeaders({
                'token': token,
                'user_id': user['id']
            });
            req = req.clone({ headers });
            this.presentLoading();
        }

        return next.handle(req).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    this.load.dismiss();
                }
                return event;
            }),
            catchError((error: HttpErrorResponse) => {
                this.load.dismiss();
                if (error.status === 401) {
                    this.base.toastMessage('Token expired. Please login again');
                    localStorage.removeItem('myToken');
                    localStorage.removeItem('myUser');
                    this.nav.navigateRoot('login');
                }
                return throwError(error);
            }));
    }

    async presentLoading() {
        const loading = await this.load.create({
            message: 'Please wait...',
            duration: 3000
        });
        await loading.present();
    }
}
