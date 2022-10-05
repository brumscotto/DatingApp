import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../_model/User.model';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model: any = {};

  constructor(
    public accountService: AccountService
  ) { }

  ngOnInit(): void { }

  public login(){
    console.log(this.model);
    this.accountService.login(this.model).subscribe({
      next: (response: User) => {
        const user = response;
      },
      error: error => {
        console.log(error);
      }
    })
  }

  public logout(){
    this.accountService.logout();
  }

}
