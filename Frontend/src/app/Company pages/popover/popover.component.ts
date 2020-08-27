import { Component, OnInit } from '@angular/core';
import { NavController, PopoverController, AlertController } from '@ionic/angular';
import { BaseService } from 'src/app/core/Services/base.service';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {

  constructor(private navCtrl: NavController, private pop: PopoverController,
    private base: BaseService, private alert: AlertController) { }

  ngOnInit() {
  }

  toProfile() {
    this.navCtrl.navigateForward(['/adminprofile']);
    this.pop.dismiss();
  }

  toInterruptions() {
    this.navCtrl.navigateForward(['/interruptions']);
    this.pop.dismiss();
  }

  async confirmLogout() {
    const alert = await this.alert.create({
      header: 'Confirm',
      message: 'Are you sure you want to logout?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            // console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Yes',
          handler: () => {
            this.logoutMe();
            this.pop.dismiss();
          }
        }
      ]
    });
    await alert.present();
  }

  logoutMe() {
    const user = JSON.parse(localStorage.getItem('myUser'));
    this.base.deletePlayerID(user.id).subscribe(response => {
      // alert("Deleted player ID : " + response);
      if (response) {
        localStorage.removeItem('myToken');
        localStorage.removeItem('myUser');
        this.navCtrl.navigateRoot(['/login']);
        this.base.toastMessage('Logged out successfully');
      }
    });
  }

}
