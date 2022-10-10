import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Member } from '../_model/Member.model';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getMembers(): Observable<Member[]>{
    return this.http.get<Member[]>(this.baseUrl + "users");
  }

  getMember(userName: string): Observable<Member>{
    return this.http.get<Member>(this.baseUrl + "users/" + userName);
  }

}
