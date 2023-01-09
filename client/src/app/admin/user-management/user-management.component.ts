import { Component, OnDestroy, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { RolesModalComponent } from 'src/app/modals/roles-modal/roles-modal.component';
import { User } from 'src/app/_model/User.model';
import { AdminService } from 'src/app/_services/admin.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit, OnDestroy {
  users!: Partial<User[]>;
  bsModalRef: BsModalRef<RolesModalComponent> = new BsModalRef<RolesModalComponent>();
  availableRoles: string[] = [
    "Admin",
    "Moderator",
    "Member"
  ];

  modalHiddenSub?: Subscription = Subscription.EMPTY;
  adminUpdateUserSub?: Subscription = Subscription.EMPTY;
  allUsersWRoleSub!: Subscription;

  constructor(
    private adminService: AdminService,
    private modalService: BsModalService) { }

  ngOnInit(): void {
    this.getUsersWithRoles();
  }

  getUsersWithRoles(){
    this.allUsersWRoleSub = this.adminService.getUsersWithRoles().subscribe(users => {
      if(users){
        this.users = users;
      }
    })
  }

  openRolesModal(user: User){
    const config: ModalOptions = {
    class: "modal-dialog-centered",
    initialState: {
        username: user.username,
        availableRoles: this.availableRoles,
        selectedRoles: [...user.roles]
      }
    }

    this.bsModalRef = this.modalService.show(RolesModalComponent, config);

    this.modalHiddenSub = this.bsModalRef.onHide?.subscribe({
      next: () => {
        const selectedRoles = this.bsModalRef.content?.selectedRoles;
        if(!this.arrayEqual(selectedRoles!, user.roles)) {
          this.adminUpdateUserSub = this.adminService.updateUserRoles(user.username, selectedRoles!).subscribe({
            next: roles => {
              user.roles = roles;
            }
          })
        }
      }
    })
  }

  private arrayEqual(arr1: any[], arr2: any[]){
    return JSON.stringify(arr1.sort()) === JSON.stringify(arr2.sort());
  }

  ngOnDestroy(): void {
    if(this.allUsersWRoleSub){
      this.allUsersWRoleSub.unsubscribe();
    }
    if(this.adminUpdateUserSub){
      this.adminUpdateUserSub.unsubscribe();
    }
    if(this.modalHiddenSub) {
      this.modalHiddenSub.unsubscribe();
    }
  }

}
