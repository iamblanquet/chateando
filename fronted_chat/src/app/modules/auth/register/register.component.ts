import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  loginForm!:FormGroup;
  hasError:Boolean = false;

  hasErrorText:any = '';

  hasSuccess:Boolean = false;
  hasSuccessText:any = '';
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
      name: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(250),
        ])
      ],
      surname: [
        null,
        Validators.compose([
          Validators.required,
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
      ],
      password_confirmation: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(100),
        ])
      ]
    })
  }

  verifyPassword(password:string, password_confirmation:string){
    return password !== password_confirmation;
  }

  submit(){
    this.hasError = false;
    this.hasErrorText = '';

    if(this.verifyPassword(this.loginForm.value.password,this.loginForm.value.password_confirmation)){
      this.hasError = true;
      this.hasErrorText = "LAS CONTRASEÑAS NO EXISTEN";
    }
    // console.log(this.loginForm.value);
    this.authServices.register(this.loginForm.value).subscribe((resp:any)=>{
      console.log(resp);
      this.hasSuccess = true;
      this.hasSuccessText = "GENIAL HAS CREADO TU USUARIO CORRECTAMENTE";
      setTimeout(() => {
        this.route.navigate(["auth/login"]);
      }, 2000);
    },error => {
      this.hasError = true;
      error.error.email.forEach((element:any) => {
        this.hasErrorText += element+", ";
      });
      // if(error.error.error == 'Unauthorized') {
      //   this.hasError = true;
      //   this.hasErrorText = "EL USUARIO NO EXISTE ACTUALMENTE";
      // }
      console.log(error);
      //CONDICIONES
    })
  }

}
