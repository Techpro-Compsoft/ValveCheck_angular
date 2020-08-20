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
  farmsList: Array<object>;
  operatorId: any;

  constructor(public navCtrl: NavController,
    public operatorService: OperatorService,
    public base: BaseService,
    public alertCtrl: AlertController) { }

  ngOnInit() {
    this.getDashboardDetails();
    this.getOperatorDetails();
  }

  getOperatorDetails() {
    let operatorData = JSON.parse(localStorage.getItem('myUser'));
    this.operatorId = operatorData.id;
  }

  getDashboardDetails() {
    let data = JSON.parse(localStorage.getItem('myUser'));
    try {
      this.operatorService.getFarmDetailsCall({
        "user_id": data.id,
        "role": data.role
      }).subscribe(response => {
        if (response.status === "success") {
          this.farmsList = response.data
        }
        else if (response.status === "error") {
          alert(response.txt);
        }
      });
    } catch (error) {
      this.base.toastMessage('Something went wrong');
    }
  }

  viewBlocks(id) {
    this.navCtrl.navigateForward([`/operator-dashboard/operator-block/${id}`]);
  }


  openProfilePage() {
    this.navCtrl.navigateForward(['/operator-dashboard/operator-profile'])
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
