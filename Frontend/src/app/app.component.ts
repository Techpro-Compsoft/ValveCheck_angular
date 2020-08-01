import { Component } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

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
    private nav: NavController
  ) {
    this.initializeApp();
    const role = localStorage.getItem('myUser');
    if (role === "1") {
      this.nav.navigateRoot('/home');
    } else if (role === "2") {
      this.nav.navigateRoot('/supervisor-dashboard');
    }
    else if (role === "3") {
      this.nav.navigateRoot('/operator-dashboard');
    }
    else {
      this.nav.navigateRoot('/login');
    }
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
