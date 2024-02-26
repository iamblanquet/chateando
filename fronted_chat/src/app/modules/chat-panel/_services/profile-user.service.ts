import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from 'src/app/config/config';
import {AuthService} from '../../auth/_services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileUserService {

  constructor(
    public http: HttpClient,
    public authServices: AuthService,
  ) { }

  UpdateProfileUser(data:any){
    let headers = new HttpHeaders({'Authorization': 'Bearer '+ this.authServices.token})
    let LINK = URL_SERVICIOS+"/users/profile-user";
    return this.http.post(LINK,data,{headers: headers});
  }

  AvatarChangeUser(file:any){
    let headers = new HttpHeaders({'Authorization': 'Bearer '+ this.authServices.token})
    let LINK = URL_SERVICIOS+"/users/profile-user";
    let formData = new FormData();
    formData.append("imagen",file,file.name);
    return this.http.post(LINK,formData,{headers: headers});
  }

  ContactUsers(){
    let headers = new HttpHeaders({'Authorization': 'Bearer '+ this.authServices.token})
    let LINK = URL_SERVICIOS+"/users/contact-users";
    return this.http.get(LINK,{headers: headers});
  }

}
