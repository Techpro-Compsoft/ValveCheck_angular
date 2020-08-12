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
            this.event.publish('ULS', '1Up')
            this.base.toastMessage('Login successful');
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
      this.presentLoading();
      let notificationData = res.notification.payload.additionalData;
      const user = JSON.parse(localStorage.getItem('myUser'));
      alert(JSON.stringify(notificationData));
      alert(JSON.stringify(user));
      if (user && user['role'] === '1') {
        alert('in admin');
        try {
          this.nav.navigateForward([`/home/companies/farms/${notificationData['farm_id']}/blocks/${notificationData['block_id']}/blocktimings/${notificationData['block_id']}/${notificationData['operator_id']}`]);
        } catch (error) {
          // alert(JSON.stringify(error));
        }
      }
      else if (user && user['role'] === '2') {
        alert('in sup');
        try {
          this.nav.navigateForward([`/supervisor-dashboard/supervisor-blocktimings/${notificationData['block_id']}`]);
        } catch (error) {
          // alert(JSON.stringify(error));
        }
      }
      else if (user && user['role'] === '3') {
        alert('in operator');
        this.nav.navigateForward([`/operator-dashboard/operator-blocktimings/${notificationData['block_id']}`]);
      }
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

  async presentLoading() {
    const loading = await this.load.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      duration: 3000
    });
    await loading.present();
  }
}