import { Component, OnInit } from '@angular/core';
import { BaseService } from 'src/app/core/Services/base.service';
import { ModalController, AlertController, NavController } from '@ionic/angular';
import { SupervisorService } from 'src/app/core/Services/Supervisor/supervisor.service';
import { ResetPasswordPage } from 'src/app/reset-password/reset-password.page';

@Component({
  selector: 'app-supervisor-profile',
  templateUrl: './supervisor-profile.page.html',
  styleUrls: ['./supervisor-profile.page.scss'],
})
export class SupervisorProfilePage implements OnInit {
  fullName: string;
  phone: string;
  supervisorId: any;
  supervisorData: any;
  constructor(public base: BaseService,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public supervisorService: SupervisorService,
    public nav: NavController) {
  }

  ngOnInit() {
    this.getSupervisorDetails();
  }

  getSupervisorDetails() {
    this.supervisorData = JSON.parse(localStorage.getItem('myUser'));
    this.fullName = this.supervisorData.fullname;
    this.phone = this.supervisorData.phone;
    this.supervisorId = this.supervisorData.id;
  }

  async openSupervisorDialog() {
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
            this.editSupervisorProfile(data)
          }
        }
      ]
    });
    await alert.present();
  }

  editSupervisorProfile(data) {
    try {
      const supObj = {
        "id": this.supervisorId,
        "fullname": data.name,
        "phone": data.phone
      }
      this.supervisorService.editSupervisorProfileCall(supObj).subscribe(response => {
        this.supervisorData.fullname = data.name;
        this.supervisorData.phone = data.phone
        localStorage.setItem('myUser', JSON.stringify(this.supervisorData));
        this.getSupervisorDetails();
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
