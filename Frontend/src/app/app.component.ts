import { Component } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';

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
    private route: Router
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
      if (this.route.url == '/login' || this.route.url == '/home') {
        navigator['app'].exitApp();
      }
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

}