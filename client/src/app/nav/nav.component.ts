import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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
    public accountService: AccountService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void { }

  public login(){
    console.log(this.model);
    this.accountService.login(this.model).subscribe({
      next: (response: User) => {
        const user = response;
        this.router.navigateByUrl('/members');
      }
    })
  }

  public logout(){
    this.accountService.logout();
    this.router.navigateByUrl('/')
  }

}
