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
            this.base.toastMessage('Login successful');
            this.push_Notification_Init();
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
        this.base.toastMessage('Something went wrong');
      }
    }
    else {
      alert('Please enter valid information');
    }
  }

  push_Notification_Init() {
    this.oneSignal.startInit('d1613e76-96f6-4b7c-a9a7-cf76811a62df', '172278637990');

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);

    this.oneSignal.handleNotificationReceived().subscribe((res) => {
      // do something when notification is received
    });

    this.oneSignal.handleNotificationOpened().subscribe((res) => {
      let json_data = res.notification.payload.additionalData.type;
      // alert(JSON.stringify(json_data));
    });

    this.oneSignal.getIds().then(res => {
      console.log(res);
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