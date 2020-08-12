import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, PopoverController } from '@ionic/angular';
import { BaseService } from '../../core/Services/base.service';
import { SupervisorService } from 'src/app/core/Services/Supervisor/supervisor.service';
import { PopoverComponent } from '../popover/popover.component';

@Component({
  selector: 'app-supervisors',
  templateUrl: './supervisors.page.html',
  styleUrls: ['./supervisors.page.scss'],
})
export class SupervisorsPage implements OnInit {

  usersList: Array<object>;

  constructor(private baseService: BaseService,
    private navCtr: NavController, private supService: SupervisorService,
    private alertCtrl: AlertController,  private pop: PopoverController) { }

  ngOnInit() {
  }

  getUsers() {
    try {
      this.baseService.getUsers({
        "role": 2
      }).subscribe(response => {
        if (response.status === "success") {
          this.usersList = response.data;
        }
        else if (response.status === "error") {
          alert(response.txt);
        }
      });
    } catch (error) {
      this.baseService.toastMessage('Something went wrong');
    }
  }

  async addSupervisor(value?, id?) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: value ? 'Update Supervisor' : 'New Supervisor',
      inputs: [
        {
          name: 'fullname',
          type: 'text',
          label: 'Name',
          placeholder: 'Full Name',
          value: value ? value.fullname : ''
        },
        {
          name: 'username',
          type: 'text',
          placeholder: 'Username',
          value: value ? value.username : ''
        },
        {
          name: 'email',
          type: 'text',
          placeholder: 'Email (optional)',
          value: value ? value.email : ''
        },
        {
          name: 'password',
          type: 'text',
          placeholder: 'Password',
          value: value ? atob(value.password) : ''
        },
        {
          name: 'phone',
          type: 'number',
          placeholder: 'Mobile',
          value: value ? value.phone : ''
        }
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
          text: value ? 'UPDATE' : 'ADD',
          handler: (data) => {
            value ? this.editSupervisor(data, id) : this.createSupervisor(data);
          }
        }
      ]
    });
    await alert.present();
  }

  checkValidation(name: string, username: string, password: string): boolean {
    if (name.trim().length === 0) {
      return false;
    }
    else if (username.trim().length === 0) {
      return false;
    }
    else if (password.trim().length === 0) {
      return false;
    } else {
      return true;
    }
  }

  createSupervisor(data) {
    data.role = 2;
    if (this.checkValidation(data.fullname, data.username, data.password)) {
      if (data.fullname.length > 50) {
        alert('Name can not be more than 50 characters');
      }
      else if (data.username.length > 20) {
        alert('Username can not be more than 50 characters');
      }
      else if (data.password.length > 50) {
        alert('Password can not be more than 50 characters');
      }
      else {
        try {
          this.baseService.createUser(data).subscribe(response => {
            if (response.status === "success") {
              this.baseService.toastMessage('Supervisor created');
              this.getUsers();
            }
            else if (response.status === "error") {
              alert(response.txt);
            }
          });
        } catch (error) {
          this.baseService.toastMessage('Something went wrong');
        }
      }
    }
    else {
      this.baseService.toastMessage('Please enter valid details');
    }
  }

  editSupervisor(data, id) {
    if (this.checkValidation(data.fullname, data.username, data.password)) {
      if (data.fullname.length > 50) {
        alert('Name can not be more than 50 characters');
      }
      else if (data.username.length > 20) {
        alert('Username can not be more than 50 characters');
      }
      else if (data.password.length > 50) {
        alert('Password can not be more than 50 characters');
      }
      else {
        try {
          this.baseService.updateUser({
            "id": id,
            "fullname": data.fullname,
            "username": data.username,
            "password": data.password,
            "phone": data.phone
          }).subscribe(response => {
            if (response.status === "success") {
              this.baseService.toastMessage('Supervisor updated');
              this.getUsers();
            }
            else if (response.status === "error") {
              alert(response.txt);
            }
          });
        } catch (error) {
          this.baseService.toastMessage('Something went wrong');
        }
      }
    }
    else {
      this.baseService.toastMessage('Please enter valid details');
    }
  }

  openDetails(uid, mode) {
    this.navCtr.navigateForward([`/home/supervisors/assigncompany/${uid}/${mode}`]);
  }

  ionViewWillEnter() {
    this.getUsers();
  }

  async presentAlertConfirm(companyId, userId) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Confirm',
      message: 'Are you sure you want to remove this person',
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
            // console.log('Confirm Okay');
            this.removeRole(companyId, userId)
          }
        }
      ]
    });
    await alert.present();
  }

  removeRole(companyId, userId) {
    try {
      this.supService.removeRole({
        "company": companyId,
        "user_id": userId,
        "role": 2
      }).subscribe(response => {
        if (response.status === "success") {
          this.baseService.toastMessage('Supervisor removed');
          this.getUsers();
        }
        else if (response.status === "error") {
          alert(response.txt);
        }
      });
    } catch (error) {
      alert('Something went wrong');
    }
  }

  toProfile() {
    this.navCtr.navigateForward(['/adminprofile']);
  }

  async presentPopover(ev: any) {
    const popover = await this.pop.create({
      component: PopoverComponent,
      cssClass: 'testPop',
      event: ev,
      translucent: true
    });
    return await popover.present();
  }
  
}