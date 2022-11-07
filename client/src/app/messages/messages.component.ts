import { Component, OnInit } from '@angular/core';
import { Message } from '../_model/Message.model';
import { PaginatedResult, Pagination } from '../_model/Pagination.model';
import { MessageService } from '../_services/message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages!: (Message | undefined)[];
  pagination!: Pagination;
  container: string = "Unread";
  pageNumber: number = 1;
  pageSize: number = 5;
  isLoading: boolean = false

  constructor(
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadMessages();
  }

  public loadMessages(){
    this.isLoading = true;
    this.messageService.getMessages(this.pageNumber, this.pageSize, this.container)
    .subscribe(response => {
      if(response){
        this.messages = response.result;
        this.pagination = response.pagination;
      }
      this.isLoading = false;
    })
  }

  deleteMessage(id: number){
    this.messageService.deleteMessage(id).subscribe(()=>{
        this.messages.splice(this.messages.findIndex(m => m!.id === id), 1);
    })
  }

  pageChanged(event: any){
    if(this.pageNumber !== event.page){
    this.pageNumber = event.page;
    this.loadMessages();
    }
  }


}
