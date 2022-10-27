import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/_model/Member.model';
import { PaginatedResult, Pagination } from 'src/app/_model/Pagination.model';
import { User } from 'src/app/_model/User.model';
import { UserParams } from 'src/app/_model/UserParams.model';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  members!: Member[];
  // members$!: Observable<Member[]>;
  pagination!: Pagination;
  pageNumber: number = 1;
  pageSize: number = 5;
  user!: User | null;
  userParams!: UserParams | null;
  genderList = [
    {
      value: 'male',
      display: 'Males'
    },
    {
      value: 'female',
      display: 'Females'
    }
  ]

  constructor(
    private memberService: MembersService) {
      this.userParams = this.memberService.getUserParams();
    }

  ngOnInit(): void {
    this.loadMembers();
    // this.members$ = this.memberService.getMembers()
  }

  loadMembers() {
    this.memberService.setUserParams(this.userParams!);
    this.memberService.getMembers(this.userParams!).subscribe((response: PaginatedResult<Member[]>) => {
      this.members = response.result;
      this.pagination = response.pagination
    })
  }

  resetFilters(){
    this.userParams = this.memberService.resetUserParams();
    this.loadMembers();
  }

  pageChanged(event: any){
    this.userParams!.pageNumber = event.page;
    this.memberService.setUserParams(this.userParams!);
    this.loadMembers();
  }

}
