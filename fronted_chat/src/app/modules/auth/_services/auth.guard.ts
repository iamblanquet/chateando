import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private auth_services: AuthService,
    private router: Router,
  ) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
    if(!this.auth_services.isLoggin()){
      this.router.navigate(["auth/login"]);
      return false;
    }
    let token = this.auth_services.token;
    let expirado = (JSON.parse(atob(token.split('.')[1]))).exp;
    if(Math.floor((new Date).getTime() / 1000) >= expirado){
      this.auth_services.logout();
      return false;
    }
    return true;
  }

}
