import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { map, tap } from 'rxjs/operators'
import { User } from '../_model/User.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  baseUrl: string = 'https://localhost:5001/api/';
  private _currentUserSource = new ReplaySubject<User | null>(1);
  currentUser$ = this._currentUserSource.asObservable();

  constructor(
    private http: HttpClient
  ) { }

  public login(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/login', model).pipe(
      tap((response: User) => {
        const user = response;
        if(user) {
          localStorage.setItem('user',JSON.stringify(user));
          this._currentUserSource.next(user);
        }
      })
    )
  }

  public register(model: any){
    return this.http.post<User>(this.baseUrl + 'account/register', model).pipe(
      tap((user: User) => {
        if(user){
          localStorage.setItem('user',JSON.stringify(user));
          this._currentUserSource.next(user);
        }
      })
    )
  }

  setCurrentUser(user: User){
    this._currentUserSource.next(user);
  }

  public logout(){
    localStorage.removeItem('user');
    this._currentUserSource.next(null);
  }

}