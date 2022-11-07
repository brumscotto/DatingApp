import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { Member } from "../_model/Member.model";
import { MembersService } from "../_services/members.service";

@Injectable({
  providedIn: 'root'
})
export class MemberDetailResolver implements Resolve<Member>{

  constructor(private memberservice: MembersService){}

  resolve(route: ActivatedRouteSnapshot): Observable<Member> {
    return this.memberservice.getMember(route.paramMap.get('username'))
  }

}
