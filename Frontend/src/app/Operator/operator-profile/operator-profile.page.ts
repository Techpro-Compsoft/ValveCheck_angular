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
    this.getProfile();
  }


  getProfile() {
    try {
      this.operatorService.getProfile().subscribe(response => {
        if (response.status == 'success') {
          this.operatorData = response.data;
          this.fullName = response.data['fullname'];
          this.phone = response.data['phone'];
          this.operatorId = response.data['id'];
        }
        else if (response.status === "error") {
          alert(response.txt);
        }
      });
    } catch (error) {
      this.base.toastMessage('Something went wrong');
    }
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
            console.log('Confirm Cancel');
          }
        }, {
          text: 'UPDATE',
          handler: (data) => {
            this.editOperatorProfile(data)
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


  editOperatorProfile(data) {
    let patt = /^[0-9]{8,12}$/g;
    let result = patt.test(data.phone);
    if (this.checkValidation(data.name)) {
      if (data.name.length > 50) {
        this.base.toastMessage('Name can not be more than 50 characters');
      }
      else if (result === false) {
        this.base.toastMessage('Phone Number must contain 8 digits to maximum 12 digits');
      } else {
        try {
          const operatorObj = {
            "id": this.operatorId,
            "fullname": data.name,
            "phone": data.phone
          }
          this.operatorService.editOperatorProfileCall(operatorObj).subscribe(response => {
            if (response.status === 'success') {
              this.operatorData.fullname = data.name;
              this.operatorData.phone = data.phone
              localStorage.setItem('myUser', JSON.stringify(this.operatorData));
              this.getOperatorDetails();
              this.base.toastMessage('Profile updated successfully');
            }
            else if (response.status === "error") {
              alert(response.txt);
            }
          });
        } catch (error) {
          this.base.toastMessage('Something went wrong');
        }
      }
    } else {
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
    this.base.deletePlayerID(this.operatorId).subscribe(response => {
      // alert("Deleted player ID : " + response);
      if (response) {
        localStorage.removeItem('myToken');
        localStorage.removeItem('myUser');
        this.nav.navigateRoot(['/login']);
        this.base.toastMessage('Logged out successfully');
      }
    });
  }


}
