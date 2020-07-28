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

 
}