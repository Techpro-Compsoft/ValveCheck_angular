import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OperatorService {

  constructor(public http: HttpClient) { }

  editOperatorProfileCall(data): Observable<any> {
    return this.http.put(`${environment.base}/updateUser`, data);
  }

  getFarmDetailsCall(data): Observable<any> {
    return this.http.post(`${environment.base}/getFarmForUsers`, data);
  }

  getBlockDetailsCall(data): Observable<any> {
    return this.http.post(`${environment.base}/getBlockForUsers`, data);
  }

  getCycleCall(data): Observable<any> {
    return this.http.post(`${environment.base}/getCycle`, data);
  }

  openBlockCall(data): Observable<any> {
    return this.http.put(`${environment.base}/openBlock`, data);
  }

  closeBlockCall(data): Observable<any> {
    return this.http.put(`${environment.base}/closeBlock`, data);
  }

  interruptBlockCall(data): Observable<any> {
    return this.http.put(`${environment.base}/interruptBlock`, data);
  }

  resumeBlockCall(data): Observable<any> {
    return this.http.put(`${environment.base}/resumeBlock`, data);
  }

}
