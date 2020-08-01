import { Component, OnInit } from '@angular/core';
import { BaseService } from 'src/app/core/Services/base.service';
import { ModalController, AlertController } from '@ionic/angular';
import { SupervisorService } from 'src/app/core/Services/Supervisor/supervisor.service';
import { ResetPasswordPage } from 'src/app/reset-password/reset-password.page';

@Component({
  selector: 'app-operator-profile',
  templateUrl: './operator-profile.page.html',
  styleUrls: ['./operator-profile.page.scss'],
})
export class OperatorProfilePage implements OnInit {
  fullName: any;
  phone: any;
  operatorId: any;
  constructor(public base: BaseService,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public supervisorService: SupervisorService) {
  }

  ngOnInit() {
    this.getOperatorDetails();
  }

  getOperatorDetails() {
    this.base.userData.subscribe((data) => {
      console.log(data);
      this.fullName = data['fullname']
      this.phone = data['phone']
      this.operatorId = data['id']
    });
  }

  async openOperatorDialog() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Edit Farm',
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
      this.supervisorService.editSupervisorProfileCall(operatorObj).subscribe(response => {
        this.base.setUser(operatorObj)
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



}
