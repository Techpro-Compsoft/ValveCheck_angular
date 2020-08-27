import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  // public userData: BehaviorSubject<any> = new BehaviorSubject<any>([]);

  constructor(private http: HttpClient, private toast: ToastController) { }

  login(data): Observable<any> {
    return this.http.post(`${environment.base}/login`, data);
  }

  createUser(data): Observable<any> {
    return this.http.post(`${environment.base}/createUser`, data);
  }

  updateUser(data): Observable<any> {
    return this.http.put(`${environment.base}/updateUser`, data);
  }

  getUsers(data): Observable<any> {
    return this.http.post(`${environment.base}/getUserDetails`, data);
  }

  resetPasswordCall(data): Observable<any> {
    return this.http.put(`${environment.base}/updateUser`, data);
  }

  addPlayerID(data) {
    return this.http.post(`${environment.base}/addPlayerId`, data);
  }

  deletePlayerID(data) {
    return this.http.post(`${environment.base}/deletePlayerId`, data);
  }

  getProfile(): Observable<any> {
    return this.http.get(`${environment.base}/getProfile`);
  }

  async toastMessage(message: string) {
    const toast = await this.toast.create({
      cssClass: 'myToastClass',
      message: message.trim(),
      duration: 3000
    });
    toast.present();
  }

  editOperatorProfileCall(data): Observable<any> {
    return this.http.put(`${environment.base}/updateUser`, data);
  }

  getAllBlocks(data): Observable<any> {
    return this.http.post(`${environment.base}/getBlocksTable`, data);
  }
  
}