import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { take } from 'rxjs/internal/operators/take';
import { User } from '../_model/User.model';
import { AccountService } from '../_services/account.service';

@Directive({
  selector: '[appHasRole]'
})
export class HasRoleDirective implements OnInit {
  @Input()appHasRole!: string[]
  user!: User;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private accountService: AccountService) {
      this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
        if(user) {
          this.user = user;
        }
      })
  }

  ngOnInit() {
    // if(this.user?.roles || this.user == null) {
    //   console.log('firing')
    //   this.viewContainerRef.clear();
    //   return
    // }

    if(this.user?.roles.some(r => this.appHasRole.includes(r))) {
      this.viewContainerRef.createEmbeddedView(this.templateRef)
    } else {
      this.viewContainerRef.clear();
    }
  }


}
