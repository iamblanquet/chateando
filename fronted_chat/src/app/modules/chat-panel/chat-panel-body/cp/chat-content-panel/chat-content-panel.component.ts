import { Component, Input, OnInit } from '@angular/core';
import { ECHO_PUSHER } from 'src/app/config/config';
import { ChatPanelService } from '../../../_services/chat-panel.service';

declare var $:any;
@Component({
  selector: 'app-chat-content-panel',
  templateUrl: './chat-content-panel.component.html',
  styleUrls: ['./chat-content-panel.component.css']
})
export class ChatContentPanelComponent implements OnInit {

  @Input() to_user:any = null;

  user:any;

  LIST_MESSAGES:any = [];

  page:number = 1;
  last_page:number = 1;
  constructor(
    private _chatPanelService: ChatPanelService,
  ) { }

  ngOnInit(): void {
    this.user = this._chatPanelService.authServices.user;
    console.log(this.user);
    this.to_user.messages.forEach((element:any) => {
      this.LIST_MESSAGES.unshift(element);
    });
    this.last_page = this.to_user.last_page;
    setTimeout(() => {
      $("#ScrollChat").scrollTop($("#ScrollChat").height());
    }, 500);

    const ECHO_PUSHER_INST = ECHO_PUSHER(this._chatPanelService.authServices.token);
    ECHO_PUSHER_INST.private("chat.room."+this.to_user.room_uniqd)
      .listen('SendMessageChat', (e:any) => {
        console.log(e);
        this.LIST_MESSAGES.push(e);
      });

      $("#ScrollChat").scroll(()=>{
        var position = $("#ScrollChat").scrollTop();
        // console.log(position);
        if(this.last_page > this.page && position == 0){
          this.page ++;
          //haces una peticion al servidor para que te devuelva los chats anteriores
          this.paginateScroll(this.page,{chat_room_id: this.to_user.room_id});
        }
      })
  }

  paginateScroll(page:any,data:any) {
    this._chatPanelService.paginateScroll(page,data).subscribe((resp:any)=>{
      console.log(resp);
      let last_message = this.LIST_MESSAGES[0];
      var etiqueta = $("#tag"+last_message.id).last();

      $("#ScrollChat").scrollTop(etiqueta.offset().top - 65);

      resp.messages.forEach((element:any) => {
        this.LIST_MESSAGES.unshift(element);
      });
    })
  }
}
