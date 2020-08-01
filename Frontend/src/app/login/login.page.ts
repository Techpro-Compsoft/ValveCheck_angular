import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BaseService } from '../core/Services/base.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

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
    if (this.loginForm.valid) {
      try {
        this.base.login(this.loginForm.value).subscribe(response => {
          if (response.status === "success") {
            alert('login success');
            localStorage.setItem('myToken', response.data.token);
            localStorage.setItem('myUser', JSON.stringify(response.data.user));
            if (response.data.user.role === "1") {
              this.nav.navigateRoot('/home');
            }
            else if (response.data.user.role === "2") {
              this.nav.navigateRoot('/supervisor-dashboard');
            }
            else if (response.data.user.role === "3") {
              this.nav.navigateRoot('/operator-dashboard');
            }
          }
          else if (response.status === "error") {
            alert(response.txt);
          }
        });
      } catch (error) {
        alert('Something went wrong');
      }
    }
    else {
      alert('Please enter valid information');
    }
  }

}