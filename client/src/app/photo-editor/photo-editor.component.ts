import { Component, Input, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../_model/Member.model';
import { Photo } from '../_model/Photo.model';
import { User } from '../_model/User.model';
import { AccountService } from '../_services/account.service';
import { MembersService } from '../_services/members.service';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Input()member!: Member;
  user: User | null = null;

  uploader!:FileUploader;
  hasBaseDropZoneOver:boolean = false;
  baseUrl:string = environment.apiUrl;

  constructor(
    private memberService: MembersService,
    private accountService: AccountService
  ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
    })
  }

  ngOnInit(): void {
    this.initializeUploader();
  }

  fileOverBase(ev: any) {
    this.hasBaseDropZoneOver = ev;
  }

  setMainPhoto(photo: Photo){
    this.memberService.setMainPhoto(photo.id).subscribe(()=>{
      if(this.user){
        this.user.photoUrl = photo.url;
        this.accountService.setCurrentUser(this.user);
        this.member.photoUrl = photo.url;
        this.member.photos.forEach(p => {
          if(p.isMain) p.isMain = false;
          if(p.id === photo.id) p.isMain = true;
        })
      }
    })
  }

  deletePhoto(photoId: number){
    this.memberService.deletePhoto(photoId).subscribe(()=>{
      if(this.user){
        this.member.photos = this.member.photos.filter(x => x.id !== photoId);
      }
    })
  }

  initializeUploader(){
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users' + '/add-photo',
      authToken: "Bearer " + this.user?.token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    }

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if(response) {
        const photo: Photo = JSON.parse(response);
        this.member.photos.push(photo);
        if(photo.isMain && this.user){
          this.user.photoUrl = photo.url;
          this.member.photoUrl = photo.url;
          this.accountService.setCurrentUser(this.user)
        }
      }
    }
  }
}
