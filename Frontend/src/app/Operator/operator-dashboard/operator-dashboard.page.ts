import { Component, OnInit, NgZone } from '@angular/core';
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


  startIndex: number;
  itemCount: number;
  endIndex: number;
  infinteLoad = true;
  arr2: Array<object>;

  constructor(public navCtrl: NavController,
    public operatorService: OperatorService,
    public base: BaseService,
    public alertCtrl: AlertController,
    private zone: NgZone) {
    this.currentDate = new Date();
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.startIndex = 0;
    this.itemCount = 10;
    this.endIndex = 10;
    this.getBlocks();
  }

  loadData(event?) {
    if (this.endIndex > this.arr2.length) {
      this.endIndex = this.arr2.length;
    }
    if (this.startIndex != this.endIndex) {
      for (let i = this.startIndex; i < this.endIndex; i++) {
        if (this.arr2[i]) {
          this.arr2[i]['expected_stop_time'] = null;
          if (this.arr2[i]['instruction'] && this.arr2[i]['actual_start_time']) {
            const d = new Date();
            let t = this.arr2[i]['actual_start_time'].split(":");
            let endTime = new Date(d.getFullYear(), d.getMonth(), d.getDate(), parseInt(t[0]), parseInt(t[1]));
            let instTime = this.arr2[i]['instruction'].split(":")
            endTime.setHours(endTime.getHours() + parseInt(instTime[0]));
            endTime.setMinutes(endTime.getMinutes() + parseInt(instTime[1]));
            this.arr2[i]['expected_stop_time'] = `${endTime.getHours()}:${endTime.getMinutes()}:00`;
            if (this.arr2[i]['actual_stop_time']) {
              let actStop = this.arr2[i]['actual_stop_time'].split(":");
              if (endTime.getHours() === parseInt(actStop[0]) && endTime.getMinutes() === parseInt(actStop[1])) {
                this.arr2[i]['onTime'] = true;
              }
              else {
                this.arr2[i]['onTime'] = false;
              }
            }
          }
          this.blocksArray.push(this.arr2[i]);
        }
      }
      this.startIndex = this.endIndex;
      if (this.endIndex + this.itemCount > this.arr2.length) {
        this.endIndex = this.endIndex + this.arr2.length - this.endIndex;
      }
      else {
        this.endIndex = this.endIndex + this.itemCount;
      }
      if (event) {
        event.target.complete();
      }
    }
    else {
      this.infinteLoad = false;
    }
  }

  doInfinite(event) {
    this.loadData(event);
  }

  getBlocks() {
    try {
      this.base.getAllBlocks({ role: 3 }).subscribe(response => {
        console.log(response);
        if (response.status === "success" && response.data.length > 0) {
          this.infinteLoad = true;
          this.zone.run(() => {
            this.arr2 = response.data;
            this.blocksArray = [];
          });
          this.loadData();
        }
      });
    } catch (error) {
      this.base.toastMessage('Something went wrong');
    }
  }

  testFn(index: number, item: any): number {
    return item.id;
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
