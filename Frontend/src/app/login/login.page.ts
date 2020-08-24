import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BaseService } from '../core/Services/base.service';
import { NavController, LoadingController } from '@ionic/angular';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { EventService } from '../core/Services/Events/events.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;

  constructor(private base: BaseService, private fb: FormBuilder,
    private nav: NavController, private oneSignal: OneSignal,
    private load: LoadingController, private event: EventService) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() { }

  attemptLogin() {
    if (this.loginForm.valid) {
      try {
        this.base.login(this.loginForm.value).subscribe(response => {
          if (response.status === "success") {
            response.data.user.companyId = response.data.company.id;
            this.event.publish('ULS', '1Up')
            this.base.toastMessage('Login successful');
            localStorage.setItem('myToken', response.data.token);
            localStorage.setItem('myUser', JSON.stringify(response.data.user));
            if (response.data.user.role === "1") {
              this.nav.navigateRoot('/home');
            }
            else if (response.data.user.role === "2") {
              this.nav.navigateRoot('/supervisor-home');
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
        this.base.toastMessage('Something went wrong');
      }
    }
    else {
      alert('Please enter valid information');
    }
  }

  async presentLoading() {
    const loading = await this.load.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      duration: 3000
    });
    await loading.present();
  }
}