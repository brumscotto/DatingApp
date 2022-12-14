import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../_model/Member.model';
import { PaginatedResult } from '../_model/Pagination.model';
import { User } from '../_model/User.model';
import { UserParams } from '../_model/UserParams.model';
import { AccountService } from './account.service';
import { getPaginatedResult, getPaginationHeaders } from './pagination-helper';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl;
  members: Member[] = [];
  memberCache = new Map();
  user!: User;
  userParams!: UserParams;

  constructor(
    private http: HttpClient,
    private accountService: AccountService
    ) {
      this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
        if(user){
          this.user = user;
          this.userParams = new UserParams(user)
        }
      })
    }

  getUserParams(){
    return this.userParams;
  }

  setUserParams(params: UserParams){
    this.userParams = params;
  }

  resetUserParams(){
    this.userParams = new UserParams(this.user!);
    return this.userParams;
  }

  getMembers(userParams: UserParams): Observable<PaginatedResult<Member[]>>{

    let response = this.memberCache.get(Object.values(userParams).join('-'))
    if(response){
      return of(response);
    }

    let params = getPaginationHeaders(userParams.pageNumber, userParams.pageSize);

    params = params.append('minAge', userParams.minAge.toString());
    params = params.append('maxAge', userParams.maxAge.toString());
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);

    return getPaginatedResult<Member[]>(this.baseUrl + 'users', params, this.http).pipe(
      tap(response => {
        this.memberCache.set(Object.values(userParams).join('-'), response);
      })
    );
  }

  addLike(username: string) {
    return this.http.post(this.baseUrl + 'likes/' + username, {});
  }

  getLikes(predicate: string, pageNumber: number, pageSize: number) {
    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append('predicate', predicate)
    return getPaginatedResult<Partial<Member[]>>(this.baseUrl + 'likes', params, this.http);
  }



  getMember(userName: string | null): Observable<Member>{
    const member = [...this.memberCache.values()]
    .reduce((arr, elem) => arr.concat(elem.result),[])
    .find((member: Member) => member.username === userName);

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
