import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../../core/Services/Company/company.service';
import { AlertController, NavController, PopoverController } from '@ionic/angular';
import { BaseService } from 'src/app/core/Services/base.service';
import { ActivatedRoute } from '@angular/router';
// import { PopoverComponent } from '../../popover/popover.component';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.page.html',
  styleUrls: ['./companies.page.scss'],
})
export class CompaniesPage implements OnInit {

  companiesList: Array<object>;

  constructor(private base: BaseService,
    private alertCtlr: AlertController, public navCtrl: NavController) { }

  ngOnInit() {
  }

  getCompanies() {
    try {
      this.base.getUsers({ role: 4 }).subscribe(response => {
        if (response.status === "success") {
          this.companiesList = response.data;
        }
        else if (response.status === "error") {
          alert(response.txt);
        }
      });
    } catch (error) {
      this.base.toastMessage('Something went wrong');
    }
  }

  async openCompanyDialog(value?, id?) {
    const alert = await this.alertCtlr.create({
      cssClass: 'my-custom-class',
      header: value ? 'Update Company' : 'New Company',
      inputs: [
        {
          name: 'fullname',
          type: 'text',
          placeholder: 'Company Name *',
          value: value ? value.fullname : ''
        },
        {
          name: 'email',
          type: 'text',
          placeholder: 'Email *',
          value: value ? value.email : ''
        },
        {
          name: 'phone',
          type: 'number',
          placeholder: 'Mobile *',
          value: value ? value.phone : ''
        },
        {
          name: 'username',
          type: 'text',
          placeholder: 'Username *',
          value: value ? value.username : ''
        },
        {
          name: 'password',
          type: 'text',
          placeholder: 'Password *',
          value: value ? atob(value.password) : ''
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'test',
          handler: () => {
            // console.log('Confirm Cancel');
          }
        }, {
          text: value ? 'UPDATE' : 'ADD',
          handler: (data) => {
            value ? this.editCompany(data, id) : this.createCompany(data);
          }
        }
      ]
    });
    await alert.present();
  }

  checkValidation(name: string, password: string, num: string, username?: string, email?: string): boolean {
    if (name.trim().length === 0) {
      return false;
    }
    else if (username && username.trim().length === 0) {
      return false;
    }
    else if (password.trim().length === 0) {
      return false;
    }
    else if (num.length === 0) {
      return false;
    }
    else if (email && email.length === 0) {
      return false;
    }
    else {
      return true;
    }
  }

  createCompany(data) {
    if (this.checkValidation(data.fullname, data.password, data.phone, data.username, data.email)) {
      const regEx = new RegExp(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
      if (data.fullname.length > 50) {
        alert('Name can not be more than 50 characters');
      }
      else if (data.username.length > 20) {
        alert('Username can not be more than 50 characters');
      }
      else if (data.password.length > 50) {
        alert('Password can not be more than 50 characters');
      }
      else if (data.phone.length <= 7 || data.phone.length > 12) {
        alert('Phone number length should be between 8-12');
      }
      else if (!regEx.test(data.email)) {
        alert('Email pattern is not correct');
      }
      else {
        try {
          this.base.createUser({
            "fullname": data.fullname.trim().replace(/\s\s+/g, ' '),
            "email": data.email.trim().replace(/\s\s+/g, ''),
            "password": data.password.trim().replace(/\s\s+/g, ''),
            "phone": data.phone.trim(),
            "username": data.username.trim().replace(/\s\s+/g, ''),
            "role": 4
          }).subscribe(response => {
            if (response.status === "success") {
              this.base.toastMessage('Company added successfully');
              this.getCompanies();
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
      this.base.toastMessage('Company details can not be empty');
    }
  }

  editCompany(data, id) {
    if (this.checkValidation(data.fullname, data.password, data.phone)) {
      if (data.fullname.length > 50) {
        alert('Name can not be more than 50 characters');
      }
      else if (data.password.length > 50) {
        alert('Password can not be more than 50 characters');
      }
      else if (data.phone.length <= 7 || data.phone.length > 12) {
        alert('Phone number length should be between 8-12');
      }
      else {
        try {
          this.base.updateUser({
            "fullname": data.fullname.trim().replace(/\s\s+/g, ' '),
            "password": data.password.trim().replace(/\s\s+/g, ''),
            "phone": data.phone.trim(),
            "id": id
          }).subscribe(response => {
            if (response.status === "success") {
              this.base.toastMessage('Company updated successfully');
              this.getCompanies();
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
      this.base.toastMessage('Company details can not be empty');
    }
  }

  // viewCompany(id) {
  //   // this.navCtrl.navigateForward([`/home/companies/farms/${id}`]);
  // }

  // assignUser(id, mode) {
  //   // this.navCtrl.navigateForward([`/home/companies/supassign/${id}/${mode}`]);
  // }

  ionViewWillEnter() {
    this.getCompanies();
  }

  viewReport(id, name) {
    this.navCtrl.navigateForward([`/home/companies/reports/${id}/${name}`]);
  }

  async confirmLogout() {
    const alert = await this.alertCtlr.create({
      header: 'Confirm',
      message: 'Are you sure you want to logout?',
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
            this.logoutMe();
          }
        }
      ]
    });
    await alert.present();
  }

  logoutMe() {
    const user = JSON.parse(localStorage.getItem('myUser'));
    this.base.deletePlayerID(user.id).subscribe(response => {
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