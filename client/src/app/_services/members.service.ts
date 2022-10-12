import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../_model/Member.model';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl;
  members: Member[] = [];

  constructor(private http: HttpClient) { }

  getMembers(): Observable<Member[]>{
    if(this.members.length > 0){
      return of(this.members);
    }
    return this.http.get<Member[]>(this.baseUrl + "users").pipe(
      tap(members => {
        this.members = members;
      })
    );
  }

  getMember(userName: string): Observable<Member>{
    const member = this.members.find(x => x.username === userName);
    if(member !== undefined) {
      return of(member);
    }
    return this.http.get<Member>(this.baseUrl + "users/" + userName);
  }

  updateMember(member: Member) {
    return this.http.put(this.baseUrl + 'users', member).pipe(
      tap(()=> {
        const index = this.members.indexOf(member);
        this.members[index] = member;
      })
    );
  }

  setMainPhoto(photoId: number){
    return this.http.put<Member>(this.baseUrl + 'users/set-main-photo/' + photoId,{});
  }

  deletePhoto(photoId: number) {
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId,{})
  }

}