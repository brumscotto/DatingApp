import { Component, OnInit } from '@angular/core';
import { User } from './_model/User.model';
import { AccountService } from './_services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Dating App';

  constructor(
    private accountService: AccountService
    ) {}

  ngOnInit() {
    this.setCurrentUser();
  }

  setCurrentUser(){
    const localUser: string | null = localStorage.getItem('user')
    const user: User = localUser ? JSON.parse(localUser) : null;
    this.accountService.setCurrentUser(user);
  }

}
