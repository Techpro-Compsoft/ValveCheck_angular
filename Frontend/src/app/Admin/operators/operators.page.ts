import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { BaseService } from '../../core/Services/base.service';
import { SupervisorService } from 'src/app/core/Services/Supervisor/supervisor.service';

@Component({
  selector: 'app-operators',
  templateUrl: './operators.page.html',
  styleUrls: ['./operators.page.scss'],
})
export class OperatorsPage implements OnInit {

  usersList: Array<object>;

  constructor(private alertCtrl: AlertController, private baseService: BaseService,
    private navCtr: NavController, private supService: SupervisorService) { }

  ngOnInit() {
  }

  getUsers() {
    this.baseService.getUsers({
      "role": 3
    }).subscribe(response => {
      if (response.status === "success") {
        this.usersList = [];
        this.usersList = response.data;
      }
    });
  }

  async addSupervisor(value?, id?) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: value ? 'Edit Operator' : 'New Operator',
      inputs: [
        {
          name: 'fullname',
          type: 'text',
          placeholder: 'Full Name',
          value: value ? value.fullname : ''
        },
        {
          name: 'email',
          type: 'text',
          placeholder: 'Email',
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
            console.log('Confirm Cancel');
          }
        }, {
          text: value ? 'EDIT' : 'ADD',
          handler: (data) => {
            value ? this.editOperator(data, id) : this.createOperator(data);
          }
        }
      ]
    });
    await alert.present();
  }

  checkValidation(name: string, email: string, password: string): boolean {
    const regEx = new RegExp(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
    if (name.trim().length === 0) {
      return false;
    } else if (!email.match(regEx) || email.length == 0) {
      return false;
    }
    else if (password.trim().length === 0) {
      return false;
    } else {
      return true;
    }
  }

  createOperator(data) {
    data.role = 3;
    if (this.checkValidation(data.fullname, data.email, data.password)) {
      try {
        this.baseService.createUser(data).subscribe(response => {
          if (response.status === "success") {
            alert('Created');
            this.getUsers();
          }
        });
      } catch (error) {
        alert('Something went wrong');
      }
    }
    else {
      alert('Please enter valid details');
    }
  }

  editOperator(data, id) {
    if (this.checkValidation(data.fullname, data.email, data.password)) {
      try {
        this.baseService.updateUser({
          "id": id,
          "fullname": data.fullname,
          "password": data.password,
          "phone": data.phone
        }).subscribe(response => {
          if (response.status === "success") {
            alert('Updated');
            this.getUsers();
          }
        });
      } catch (error) {
        alert('Something went wrong');
      }
    }
    else {
      alert('Please enter valid details');
    }
  }

  ionViewWillEnter() {
    this.getUsers();
  }

  openDetails(uid, mode) {
    this.navCtr.navigateForward([`/home/operators/assigncompany/${uid}/${mode}`]);
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
            console.log('Confirm Okay');
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
        "role": 3
      }).subscribe(response => {
        if (response.status === "success") {
          alert('Removed');
          this.getUsers();
        }
      });
    } catch (error) {
      alert('Something went wrong');
    }
  }

  toProfile() {
    this.navCtr.navigateForward(['/adminprofile']);
  }

}