import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupervisorService {

  constructor(private http: HttpClient) { }

  getUsers(data): Observable<any> {
    return this.http.post(`${environment.base}/getEmptyUsersCompany`, data);
  }

  assignOperator(data): Observable<any> {
    return this.http.post(`${environment.base}/assignCompany`, data);
  }

  removeRole(data): Observable<any> {
    return this.http.post(`${environment.base}/deleteAssignCompany`, data);
  }

  editSupervisorProfileCall(data): Observable<any> {
    return this.http.put(`${environment.base}/updateUser`, data);
  }

  getFarmDetailsCall(data): Observable<any> {
    return this.http.post(`${environment.base}/getFarmForUsers`, data);
  }

  getBlockDetailsCall(data): Observable<any> {
    return this.http.post(`${environment.base}/getBlockForUsers`, data);
  }


}