import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private http: HttpClient) { }

  fetchCompanies(): Observable<any> {
    return this.http.get(`${environment.base}/getCompanies`);
  }

  createCompany(data): Observable<any> {
    return this.http.post(`${environment.base}/createCompany`, data);
  }

  updateCompany(data): Observable<any> {
    return this.http.put(`${environment.base}/updateCompany`, data);
  }

  getFarmsForCompany(data): Observable<any> {
    return this.http.post(`${environment.base}/getCompanyDetails`, data);
  }

  getCompanies(data): Observable<any> {
    return this.http.post(`${environment.base}/getEmptyCompanies`, data);
  }

  getReports(data): Observable<any> {
    return this.http.post(`${environment.base}/getReport`, data);
  }

  getReasons(): Observable<any> {
    return this.http.get(`${environment.base}/getReason`);
  }

  addReason(data): Observable<any> {
    return this.http.post(`${environment.base}/addReason`, data);
  }

  deleteReason(id): Observable<any> {
    return this.http.post(`${environment.base}/delReason`, id);
  }
  

}