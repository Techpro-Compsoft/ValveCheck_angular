import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { OperatorService } from 'src/app/core/Services/Operator/operator.service';
import { BaseService } from 'src/app/core/Services/base.service';

@Component({
  selector: 'app-operator-dashboard',
  templateUrl: './operator-dashboard.page.html',
  styleUrls: ['./operator-dashboard.page.scss'],
})
export class OperatorDashboardPage implements OnInit {
  operatorId: any;
  blocksArray: Array<object>;
  currentDate: Date;

  constructor(public navCtrl: NavController,
    public operatorService: OperatorService,
    public base: BaseService,
    public alertCtrl: AlertController) {
    this.currentDate = new Date();
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getBlocks();
  }

  getBlocks() {
    try {
      this.base.getAllBlocks({ role: 3 }).subscribe(response => {
        if (response.status === "success") {
          this.blocksArray = response.data;
          this.blocksArray.forEach(e => {
            e['expected_stop_time'] = null;
            if (e['instruction'] && e['actual_start_time']) {
              const d = new Date();
              let t = e['actual_start_time'].split(":");
              let endTime = new Date(d.getFullYear(), d.getMonth(), d.getDate(), parseInt(t[0]), parseInt(t[1]));
              let instTime = e['instruction'].split(":")
              endTime.setHours(endTime.getHours() + parseInt(instTime[0]));
              endTime.setMinutes(endTime.getMinutes() + parseInt(instTime[1]));
              e['expected_stop_time'] = `${endTime.getHours()}:${endTime.getMinutes()}:00`;
              if (e['actual_stop_time']) {
                let actStop = e['actual_stop_time'].split(":");
                if (endTime.getHours() === parseInt(actStop[0]) && endTime.getMinutes() === parseInt(actStop[1])) {
                  e['onTime'] = true;
                }
                else {
                  e['onTime'] = false;
                }
              }
            }
          });
        }
      })
    } catch (error) {
      this.base.toastMessage('Something went wrong');
    }
  }

  viewValves(id, lat, lng) {
    if (lat == "" && lng == "") {
      let lat = null;
      let lng = null;
      this.navCtrl.navigateForward([`/operator-dashboard/operator-blocktimings/${id}/${lat}/${lng}`]);
    }
    else {
      this.navCtrl.navigateForward([`/operator-dashboard/operator-blocktimings/${id}/${lat}/${lng}`]);
    }
  }

  async logoutAlert() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Confirm',
      message: 'Do you want to logout?',
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
            this.logout();
          }
        }
      ]
    });
    await alert.present();
  }

  logout() {
    this.base.deletePlayerID(this.operatorId).subscribe(response => {
      if (response) {
        localStorage.removeItem('myToken');
        localStorage.removeItem('myUser');
        this.navCtrl.navigateRoot(['/login']);
        this.base.toastMessage('Logged out successfully');
      }
    });
  }

}
