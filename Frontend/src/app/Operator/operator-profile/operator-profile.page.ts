import { Component, OnInit } from '@angular/core';
import { BaseService } from 'src/app/core/Services/base.service';
import { ModalController, AlertController, NavController } from '@ionic/angular';
import { ResetPasswordPage } from 'src/app/reset-password/reset-password.page';
import { OperatorService } from 'src/app/core/Services/Operator/operator.service';

@Component({
  selector: 'app-operator-profile',
  templateUrl: './operator-profile.page.html',
  styleUrls: ['./operator-profile.page.scss'],
})
export class OperatorProfilePage implements OnInit {
  fullName: string;
  phone: string;
  operatorId: any;
  operatorData: any;
  constructor(public base: BaseService,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public operatorService: OperatorService,
    private nav: NavController) {
  }

  ngOnInit() {
    this.getOperatorDetails();
  }

  getOperatorDetails() {
    this.operatorData = JSON.parse(localStorage.getItem('myUser'));
    this.fullName = this.operatorData.fullname;
    this.phone = this.operatorData.phone;
    this.operatorId = this.operatorData.id;
  }

  async openOperatorDialog() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Edit Profile',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Full Name',
          value: this.fullName
        },
        {
          name: 'phone',
          type: 'text',
          placeholder: 'Phone No.',
          value: this.phone
        },

      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'EDIT',
          handler: (data) => {
            this.editOperatorProfile(data)
          }
        }
      ]
    });
    await alert.present();
  }

  editOperatorProfile(data) {
    try {
      const operatorObj = {
        "id": this.operatorId,
        "fullname": data.name,
        "phone": data.phone
      }
      this.operatorService.editOperatorProfileCall(operatorObj).subscribe(response => {
        this.operatorData.fullname = data.name;
        this.operatorData.phone = data.phone
        localStorage.setItem('myUser', JSON.stringify(this.operatorData));
        this.getOperatorDetails();
      });
    } catch (error) {
      console.log(error)
    }
  }

  async resetPassword() {
    const modal = await this.modalCtrl.create({
      component: ResetPasswordPage,
    });
    modal.onDidDismiss().then(res => {
    });
    return await modal.present();
  }

  logout() {
    localStorage.removeItem('myToken');
    localStorage.removeItem('myUser');
    this.nav.navigateRoot(['/login']);
  }


}
