import { Component } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { BaseService } from './core/Services/base.service';
import { EventService } from './core/Services/Events/events.service';

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
    private route: Router, private event: EventService,
    private oneSignal: OneSignal, private base: BaseService
  ) {
    this.initializeApp();
    const user = JSON.parse(localStorage.getItem('myUser'));
    if (user) {
      if (user && user['role'] === "1") {
        this.nav.navigateRoot('/home');
      } else if (user && user['role'] === "2") {
        this.nav.navigateRoot('/supervisor-home');
      }
      else if (user && user['role'] === "3") {
        this.nav.navigateRoot('/operator-dashboard');
      }
      if (this.platform.is('cordova')) {
        this.push_Notification_Init(false);
      }
    }
    else {
      this.nav.navigateRoot('/login');
    }
  }

  backbuttonSubscribeMethod() {
    this.platform.backButton.subscribe(() => {
      if (this.route.url == '/login' || this.route.url == '/home/companies' || this.route.url == '/home/supervisors' || this.route.url == '/home/operators' || this.route.url == "/operator-dashboard" ||
        this.route.url == "/supervisor-home/supervisor-dashboard" || this.route.url == '/supervisor-home/supervisor-instructions') {
        navigator['app'].exitApp();
      }
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.backbuttonSubscribeMethod();
      if (this.platform.is('cordova')) {
        this.event.subscribe('ULS', (val: any) => {
          if (val) {
            // alert('event ' + JSON.stringify(val));
            this.push_Notification_Init(true);
          }
        })
      }
    });
  }

  ngOnDestroy() {
    this.platform.backButton.unsubscribe();
  }

  push_Notification_Init(bool) {
    if (this.platform.is('android')) {
      this.oneSignal.startInit('d1613e76-96f6-4b7c-a9a7-cf76811a62df', '172278637990');
    }
    else if (this.platform.is('ios')) {
      this.oneSignal.startInit('d1613e76-96f6-4b7c-a9a7-cf76811a62df');
    }

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);

    this.oneSignal.handleNotificationReceived().subscribe((res) => {
      // do something when notification is received
    });

    this.oneSignal.handleNotificationOpened().subscribe((res) => {
      let notificationData = res.notification.payload.additionalData;
      const user = JSON.parse(localStorage.getItem('myUser'));
      // alert(JSON.stringify(notificationData));
      // alert(JSON.stringify(user));
      if (user && user['role'] === '1') {
        // alert('in admin');
        try {
          // this.nav.navigateForward([`/home/companies/farms/${notificationData['farm_id']}/blocks/${notificationData['block_id']}/blocktimings/${notificationData['block_id']}/${notificationData['operator_id']}`]);
          this.nav.navigateForward([`/home/instructions/blocktimings/${notificationData['block_id']}/${notificationData['operator_id']}`]);
        } catch (error) {
          // alert(JSON.stringify(error));
        }
      }
      else if (user && user['role'] === '2') {
        // alert('in sup');
        try {
          this.nav.navigateForward([`/supervisor-blocktimings/${notificationData['block_id']}`]);
        } catch (error) {
          // alert(JSON.stringify(error));
        }
      }
      else if (user && user['role'] === '3') {
        // alert('in operator');
        this.nav.navigateForward([`/operator-dashboard/operator-blocktimings/${notificationData['block_id']}/${notificationData['lat']}/${notificationData['long']}`]);
      }
    });

    if (bool) {
      this.oneSignal.getIds().then(res => {
        // alert(JSON.stringify(res.userId));
        this.base.addPlayerID({ player_id: res.userId }).subscribe(response => {
          //response
        });
      });
    }

    this.oneSignal.endInit();
  }

}