import { Component, OnInit } from '@angular/core';
import { ECHO_PUSHER } from 'src/app/config/config';
import { ChatPanelService } from '../_services/chat-panel.service';
import { ProfileUserService } from '../_services/profile-user.service';

declare var $:any;
@Component({
  selector: 'app-chat-panel-body',
  templateUrl: './chat-panel-body.component.html',
  styleUrls: ['./chat-panel-body.component.css']
})
export class ChatPanelBodyComponent implements OnInit {


  users_contacts:any = [];

  to_user:any = null;
  loadChatPanelContent:Boolean = true;

  message_text_area:any = null;

  chat_chat_rooms:any = [];

  users_actives:any = [];

  uploadFile:any = null;
  constructor(
    private _userProfileService: ProfileUserService,
    private _chatPanelService: ChatPanelService,
  ) { }

  ngOnInit(): void {
    $("body").removeClass("profile-tab-open");
    $("body").addClass("chats-tab-open");

    $('[data-chat-info-toggle]').on('click', (e:any) => {
      e.preventDefault()
        $(".chat-info").addClass("chat-info-visible");
    })
    $('[data-chat-info-close]').on('click', (e:any) => {
        e.preventDefault()
        $(".chat-info").removeClass("chat-info-visible");
    })

    $("#messageInput").emojioneArea();
    this.ContactsUsers();

    this.listMyFriends();

    const ECHO_PUSHER_INST = ECHO_PUSHER(this._chatPanelService.authServices.token);
    ECHO_PUSHER_INST.private("chat.refresh.room."+this._userProfileService.authServices.user.id)
      .listen('RefreshMyChatRoom', (e:any) => {
        console.log(e);
        this.chat_chat_rooms = [];
        this.chat_chat_rooms = e.chatrooms;
        this.asignedUserActive();
      });

    ECHO_PUSHER_INST.join("onlineusers").here((users:any)=>{
      console.log(users);
      this.users_actives = users;
      this.asignedUserActive();
    }).joining((user:any)=>{
      console.log(user);

      const found = this.users_actives.some((el:any) => el.id == user.id);
      if(!found) this.users_actives.push(user);

      this.asignedUserActive();

    }).leaving((user:any)=>{
      console.log(user);

      const Index = this.users_actives.findIndex((item:any) => item.id == user.id);
      this.users_actives.splice(Index,1);

      const IndexA = this.chat_chat_rooms.findIndex((item:any) => {
        if(item.friend_first){
          return item.friend_first.id == user.id;
        }else if (item.friend_second){
          return item.friend_second.id == user.id;
        }
        return;
      });
      if(IndexA != -1){
        this.chat_chat_rooms[IndexA].is_active = false;
      }
      const IndexN = this.users_contacts.findIndex((item:any) => item.id == user.id);
      if(IndexN != -1){
        this.users_contacts[IndexN].is_active = false;
      }
      if(this.to_user && this.to_user.user.id == user.id){
        this.to_user.is_active = false;
      }
    })

  }

  asignedUserActive(){
    for (const user of this.users_actives) {
      const Index = this.chat_chat_rooms.findIndex((item:any) => {
        if(item.friend_first){
          return item.friend_first.id == user.id;
        }else if (item.friend_second){
          return item.friend_second.id == user.id;
        }
        return;
      });

      if(Index != -1){
        this.chat_chat_rooms[Index].is_active = true;
      }

      const IndexN = this.users_contacts.findIndex((item:any) => item.id == user.id);
      if(IndexN != -1){
        this.users_contacts[IndexN].is_active = true;
      }

      if(this.to_user && this.to_user.user.id == user.id){
        this.to_user.is_active = true;
      }
    }
  }

  ContactsUsers(){
    this._userProfileService.ContactUsers().subscribe((resp:any) => {
      console.log(resp);
      this.users_contacts = resp.users
    })
  }

  startChat(value:number){
    let data = {
      to_user_id: value,
    }
    this.loadChatPanelContent = false;
    this._chatPanelService.startChat(data).subscribe((resp:any) => {
      console.log(resp);
      this.loadChatPanelContent = true;
      setTimeout(() => {
        $("#messageInput").emojioneArea();
      }, 50);
      $("#startConversation").modal("hide");
      this.to_user = resp;
      this.asignedUserActive();
    })
  }

  loadMyChat(item:any){
    item.count_message = 0;
    let to_user_id = 0;
    if(item.friend_first){
      to_user_id = item.friend_first.id;
    }else{
      to_user_id = item.friend_second.id;
    }
    item.is_chat_active = true;
    this.chat_chat_rooms.map((element:any)=>{
      if(element.uniqd != item.uniqd){
        element.is_chat_active = false;
      }
      return element;
    })
    this.startChat(to_user_id);
  }

  sendMessageText(){
    console.log(this.message_text_area);
    this.message_text_area = $(".emojionearea-editor").html();
    let data = {
      chat_room_id: this.to_user.room_id,
      message: this.message_text_area,
      to_user_id: this.to_user.user.id,
    };
    this.message_text_area = null;
    $(".emojionearea-editor").html("");
    this._chatPanelService.sendMessageTxt(data).subscribe((resp:any) => {
      console.log(resp);
    })
  }
  SENDMESSAGE(){
    if(this.uploadFile){
      this.sendFileAndMessageText();
    }else{
      this.sendMessageText();
    }
  }
  sendFileAndMessageText(){

    let formData = new FormData();
    let index = 0;
    for (const iterator of this.uploadFile) {
      formData.append("files"+"["+index+"]", iterator);
      index ++;
    }
    this.message_text_area = $(".emojionearea-editor").html();
    formData.append("chat_room_id",this.to_user.room_id)
    formData.append("message",this.message_text_area)
    formData.append("to_user_id",this.to_user.user.id)
    this.message_text_area = null;
    $(".emojionearea-editor").html("");
    this.uploadFile = null;
    this._chatPanelService.sendFileAndMessageText(formData).subscribe((resp:any)=>{
      console.log(resp);
    })
  }
  listMyFriends(){
    this._chatPanelService.listMyChatRooms({}).subscribe((resp:any) => {
      console.log(resp);
      this.chat_chat_rooms = resp.chatrooms;
    })
  }

  processFile(event:any){
    console.log(event);
    this.uploadFile = event.target.files;
  }
}
