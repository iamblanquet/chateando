import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ECHO_PUSHER } from 'src/app/config/config';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!:FormGroup;
  hasError:Boolean = false;

  hasErrorText:any = '';
  constructor(
    private fb: FormBuilder,
    private authServices: AuthService,
    private route: Router,
    private router: ActivatedRoute,
  ) {
    if(this.authServices.isLoggin()){
      this.route.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.initForm();
  }

  ngAfterViewInit(): void {
    ECHO_PUSHER("").channel('trades')
            .listen('NewTrade', (e:any) => {
                console.log(e);
            })
  }
  initForm(){
    this.loginForm = this.fb.group({
      email: [
        null,
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(3),
          Validators.maxLength(250),
        ])
      ],
      password: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(100),
        ])
      ]
    })
  }

  submit(){
    this.hasError = false;
    // console.log(this.loginForm.value);
    this.authServices.login(this.loginForm.value.email,this.loginForm.value.password).subscribe((resp:any)=>{
      console.log(resp);
      if(!resp.error && resp){
        document.location.reload();
      }else{
        if(resp.error.error == 'Unauthorized') {
          this.hasError = true;
          this.hasErrorText = "HUBO PROBLEMAS CON EL USUARIO INGRESADO";
        }
      }
    },error => {
      // if(error.error.error == 'Unauthorized') {
      //   this.hasError = true;
      //   this.hasErrorText = "EL USUARIO NO EXISTE ACTUALMENTE";
      // }
      console.log(error);
      //CONDICIONES
    })
  }
}
