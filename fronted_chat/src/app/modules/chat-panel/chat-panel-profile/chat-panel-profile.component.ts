import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProfileUserService } from '../_services/profile-user.service';

declare var $:any;
@Component({
  selector: 'app-chat-panel-profile',
  templateUrl: './chat-panel-profile.component.html',
  styleUrls: ['./chat-panel-profile.component.css']
})
export class ChatPanelProfileComponent implements OnInit {

  profileGeneral!:FormGroup;
  profileSocialNetwork!:FormGroup;
  profilePassword!:FormGroup;

  user:any;

  avatar:any;
  constructor(
    private fb: FormBuilder,
    private _serviceProfileUser: ProfileUserService,
  ) { }

  ngOnInit(): void {
    $("body").removeClass("chats-tab-open");
    $("body").addClass("profile-tab-open");
    this.user = this._serviceProfileUser.authServices.user;
    this.avatar = this.user.avatar ? this.user.avatar : "./assets/media/avatar/3.png";
    this.FormProfileGeneral();
    this.FormSocialNetwork();
    this.FormPassword();
  }

  FormProfileGeneral(){
    this.profileGeneral = this.fb.group({
      name: [this.user.name],
      surname: [this.user.surname],
      phone: [this.user.phone],
      birthdate: [this.user.birthdate],
      email: [this.user.email],
      website: [this.user.website],
      address: [this.user.address],
    })
  }

  FormSocialNetwork(){
    this.profileSocialNetwork = this.fb.group({
      fb: [this.user.fb],
      tw: [this.user.tw],
      linke: [this.user.linke],
      inst: [this.user.inst],
    })
  }

  FormPassword(){
    this.profilePassword = this.fb.group({
      password: [null],
      confirmed_password: [null],
    })
  }

  SaveProfileUser(){
    console.log(this.profileGeneral.value);
    this._serviceProfileUser.UpdateProfileUser(this.profileGeneral.value).subscribe((resp:any)=>{
      console.log(resp);
      localStorage.setItem("user", JSON.stringify(resp.user));
    },error => {
      console.log(error);
    })
  }

  saveSocialNetwork(){
    console.log(this.profileSocialNetwork.value);
    this._serviceProfileUser.UpdateProfileUser(this.profileSocialNetwork.value).subscribe((resp:any)=>{
      console.log(resp);
      localStorage.setItem("user", JSON.stringify(resp.user));
    },error => {
      console.log(error);
    })
  }
  verifyPassword(password:string,confirmed_password:string){
    return password != confirmed_password;
  }
  saveResetPassword() {
    console.log(this.profilePassword.value);
    if(this.verifyPassword(this.profilePassword.value.password,this.profilePassword.value.confirmed_password)){
      console.log("SON INCORRECTAS LAS CONTRASEÑAS");
      return;
    }
    this._serviceProfileUser.UpdateProfileUser(this.profilePassword.value).subscribe((resp:any)=>{
      console.log(resp);
      localStorage.setItem("user", JSON.stringify(resp.user));
    },error => {
      console.log(error);
    })
  }
  changeAvatar(target: any){
    if(target.files[0].type.indexOf("image") < 0){
      console.log("NO ES UNA IMAGEN");
      return;
    }
    let AVATAR_FILE = target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(AVATAR_FILE);
    reader.onloadend = () => this.avatar = reader.result;
    this._serviceProfileUser.AvatarChangeUser(AVATAR_FILE).subscribe((resp:any)=>{
      this.avatar = resp.user.avatar;
      localStorage.setItem("user", JSON.stringify(resp.user));
    },error => {
      console.log(error);
    })
  }

  Logout(){
    this._serviceProfileUser.authServices.logout();
  }
}
