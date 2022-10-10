import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/_model/Member.model';
import { User } from 'src/app/_model/User.model';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm')editForm!: NgForm;
  member!: Member;
  user!: User;
  @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any){
    if(this.editForm.dirty){
      $event.returnValue = true;
    }
  }

  constructor(
    private memberService: MembersService,
    private accountService: AccountService,
    private toastr: ToastrService
  ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      if(user){
        this.user = user;
      }
    })
   }

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember(){
    this.memberService.getMember(this.user.userName).subscribe(member => {
      this.member = member;
    })
  }

  updateMember(){
    console.log(this.member);
    this.memberService.updateMember(this.member).subscribe(()=>{
      this.toastr.success("Profile updated successfully!")
      this.editForm.reset(this.member);
    })
  }

}
