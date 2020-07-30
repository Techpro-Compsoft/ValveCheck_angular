import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FarmService {

  constructor(private http: HttpClient) { }

  createFarm(data): Observable<any>{
    return this.http.post(`${environment.base}/createFarm`, data);
  }

  updateFarm(data): Observable<any>{
    return this.http.put(`${environment.base}/updateFarm`, data);
  }

  getBlocks(data): Observable<any>{
    return this.http.post(`${environment.base}/getBlockList`, data);
  }

  createBlock(data): Observable<any>{
    return this.http.post(`${environment.base}/createBlock`, data);
  }

  updateBlock(data): Observable<any>{
    return this.http.put(`${environment.base}/updateBlock`, data);
  }

}