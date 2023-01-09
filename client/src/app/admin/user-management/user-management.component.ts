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
  ]
  // selectedRoles: string[] = []

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

    this.bsModalRef.onHide?.subscribe({
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

    // this.bsModalRef.content?.updateSelectedRoles.subscribe({
    //   next: (values: any) => {
    //     console.log(values, typeof values);

    //     let roles: string[] = values;

    //     this.adminUpdateUserSub = this.adminService.updateUserRoles(user.username, roles).subscribe(()=> {
    //         user.roles = [...roles];
    //     })
    //   }
    // });
  }

  private arrayEqual(arr1: any[], arr2: any[]){
    return JSON.stringify(arr1.sort()) === JSON.stringify(arr2.sort());
  }

  private getRolesArray(user: User){
    const userRoles = user.roles;
    const availableRoles: any[] = [
        {name: "Admin", value: "Admin", checked: false},
        {name: "Moderator", value: "Moderator", checked: false},
        {name: "Member", value: "Member",checked: false},
    ];

    for (let role of availableRoles){
      if(userRoles.includes(role.name)){
        role.checked = true;
      }
    }
    return availableRoles;

    // const roles: any[] = [];
    // const userRoles = user.roles;
    // const availableRoles: any[] = [
    //   {name: "Admin", value: "Admin"},
    //   {name: "Moderator", value: "Moderator"},
    //   {name: "Member", value: "Member"},
    // ]
    // availableRoles.forEach(role => {
    //   let isMatch = false;
    //   for (const userRole of userRoles){
    //     if(role.name == userRole) {
    //       isMatch = true;
    //       role.checked = true;
    //       roles.push(role);
    //       break;
    //     }
    //     if(!isMatch){
    //       role.checked = false;
    //       roles.push(role)
    //     }
    //   }
    // });

    // console.log(roles);
    // return roles;
  }

  ngOnDestroy(): void {
    if(this.allUsersWRoleSub){
      this.allUsersWRoleSub.unsubscribe();
    }
    if(this.adminUpdateUserSub){
      this.adminUpdateUserSub.unsubscribe();
    }
  }

}
