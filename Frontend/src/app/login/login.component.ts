import { Component, OnInit } from '@angular/core';
import { BaseService } from '../core/Services/base.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private base: BaseService, private fb: FormBuilder,
    private nav: NavController) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() { }

  attemptLogin() {
    // if (this.loginForm.valid) {
    //   try {
    //     this.base.login(this.loginForm.value).subscribe(response => {
    //       if (response.status === "success") {
    //         alert('login success');
    //         this.nav.navigateRoot('/home');
    //       }
    //       else if (response.status === "error") {
    //         alert(response.txt);
    //       }
    //     });
    //   } catch (error) {
    //     alert('Something went wrong');
    //   }
    // }
    // else{
    //   alert('Please enter valid information');
    // }
    this.nav.navigateRoot('/home');
  }

}