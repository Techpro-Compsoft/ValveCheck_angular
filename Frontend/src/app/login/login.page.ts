import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BaseService } from '../core/Services/base.service';
import { NavController } from '@ionic/angular';
import { OneSignal } from '@ionic-native/onesignal/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;

  constructor(private base: BaseService, private fb: FormBuilder,
    private nav: NavController, private oneSignal: OneSignal) {
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

  push_Notification_Init() {
    this.oneSignal.startInit('a2377344-621c-4ead-8928-2b70705417c2', '225308115216');

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);

    this.oneSignal.handleNotificationReceived().subscribe((res) => {
      // do something when notification is received
    });

    this.oneSignal.handleNotificationOpened().subscribe((res) => {
      let json_data = res.notification.payload.additionalData.type;
      // alert(JSON.stringify(json_data));
    });

    this.oneSignal.getIds().then(res => {
      let playerObj = {
        // "user_id": "Chhavi",
        "player_id": res.userId,
      }
      localStorage.setItem('PlayerId', res.userId);
      this.base.addPlayerID(playerObj).subscribe(response => {
        // response 
      });
    });

    this.oneSignal.endInit();
  }

}