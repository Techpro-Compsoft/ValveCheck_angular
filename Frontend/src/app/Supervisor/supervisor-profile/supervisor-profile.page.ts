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
      header: 'Update Profile',
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
            // console.log('Confirm Cancel');
          }
        }, {
          text: 'UPDATE',
          handler: (data) => {
            this.editSupervisorProfile(data)
          }
        }
      ]
    });
    await alert.present();
  }

  checkValidation(name: string): boolean {
    if (name.trim().length === 0) {
      return false;
    }
    else {
      return true;
    }
  }


  editSupervisorProfile(data) {
    let patt = /^[0-9]{8,10}$/g;
    let result = patt.test(data.phone);
    if (this.checkValidation(data.name)) {
      if (data.name.length > 50) {
        this.base.toastMessage('Name can not be more than 50 characters');
      }
      else if (result === false) {
        this.base.toastMessage('Phone Number must contain 8 digits to maximum 10 digits');
      } else {
        try {
          const supObj = {
            "id": this.supervisorId,
            "fullname": data.name,
            "phone": data.phone
          }
          this.supervisorService.editSupervisorProfileCall(supObj).subscribe(response => {
            if (response.status === 'success') {
              this.supervisorData.fullname = data.name;
              this.supervisorData.phone = data.phone
              localStorage.setItem('myUser', JSON.stringify(this.supervisorData));
              this.getSupervisorDetails();
            }
            else if (response.status === "error") {
              alert(response.txt);
            }

          });
        } catch (error) {
          this.base.toastMessage('Something went wrong');
        }
      }
    }
    else {
      this.base.toastMessage('Please enter valid details');
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
