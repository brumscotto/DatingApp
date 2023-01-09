import { Component, EventEmitter, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { User } from 'src/app/_model/User.model';

@Component({
  selector: 'app-roles-modal',
  templateUrl: './roles-modal.component.html',
  styleUrls: ['./roles-modal.component.css']
})
export class RolesModalComponent implements OnInit {
  // updateSelectedRoles: EventEmitter<any> = new EventEmitter();
  // user!: User;
  // roles!: any[];
  username: string = '';
  availableRoles: any[] = [];
  selectedRoles: any[] = [];

  constructor(public bsModalRef: BsModalRef) {}

  ngOnInit(): void {  }

  updateChecked(checkedValue: string){
    const index = this.selectedRoles.indexOf(checkedValue);

    index !== -1 ? this.selectedRoles.splice(index, 1) : this.selectedRoles.push(checkedValue);
  }

  // updateRoles(){
    // let rolesToUpdate: string[] = this.roles.filter((el:any) => el.checked = true).map((el: any) => el.name);
    // console.log(this.roles, rolesToUpdate);
    // this.updateSelectedRoles.emit(rolesToUpdate)
    // this.bsModalRef.hide();
  // }

}
