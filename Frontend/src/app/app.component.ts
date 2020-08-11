import { Component } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { BaseService } from './core/Services/base.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private nav: NavController,
    private route: Router,
    private oneSignal: OneSignal, private base: BaseService
  ) {
    this.initializeApp();
    const user = JSON.parse(localStorage.getItem('myUser'));
    if (user && user['role'] === "1") {
      this.nav.navigateRoot('/home');
    } else if (user && user['role'] === "2") {
      this.nav.navigateRoot('/supervisor-dashboard');
    }
    else if (user && user['role'] === "3") {
      this.nav.navigateRoot('/operator-dashboard');
    }
    else {
      this.nav.navigateRoot('/login');
    }
  }

  backbuttonSubscribeMethod() {
    this.platform.backButton.subscribe(() => {
      if (this.route.url == '/login' || this.route.url == '/home/companies' || this.route.url == "/operator-dashboard" ||
        this.route.url == "/supervisor-dashboard") {
        navigator['app'].exitApp();
      }
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.backbuttonSubscribeMethod();
      this.push_Notification_Init();
    });
  }

  ngOnDestroy() {
    this.platform.backButton.unsubscribe();
  }

  async push_Notification_Init() {
    this.oneSignal.startInit('d1613e76-96f6-4b7c-a9a7-cf76811a62df', '172278637990');

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);

    this.oneSignal.handleNotificationReceived().subscribe((res) => {
      // do something when notification is received
    });

    this.oneSignal.handleNotificationOpened().subscribe((res) => {
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

    await this.oneSignal.getIds().then(res => {
      localStorage.setItem('PlayerId', res.userId);
    });
    this.oneSignal.endInit();
  }

}