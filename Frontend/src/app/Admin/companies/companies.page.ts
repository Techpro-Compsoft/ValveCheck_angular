import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../../core/Services/Company/company.service';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.page.html',
  styleUrls: ['./companies.page.scss'],
})
export class CompaniesPage implements OnInit {

  companiesList: Array<object>;

  constructor(private companyService: CompanyService,
    private alertCtlr: AlertController, public navCtrl: NavController
  ) { }

  ngOnInit() {
  }

  getCompanies() {
    try {
      this.companyService.fetchCompanies().subscribe(response => {
        if (response.status === "success") {
          this.companiesList = [];
          this.companiesList = response.data;
        }
        else if (response.status === "error") {
          alert(response.txt);
        }
      });
    } catch (error) {
      alert('Something went wrong');
    }
  }

  async openCompanyDialog(value?, id?) {
    const alert = await this.alertCtlr.create({
      cssClass: 'my-custom-class',
      header: value ? 'Edit Company' : 'New Company',
      inputs: [
        {
          name: 'name1',
          type: 'text',
          placeholder: 'Company Name',
          value: value ? value : ''
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
            value ? this.editCompany(data.name1, id) : this.createCompany(data.name1);
          }
        }
      ]
    });
    await alert.present();
  }

  createCompany(name: string) {
    if (name != null && name.length > 0) {
      if (name.length < 100) {
        try {
          this.companyService.createCompany({
            "company_name": name.trim()
          }).subscribe(response => {
            if (response.status === "success") {
              alert('Company added');
              this.getCompanies();
            }
            else if (response.status === "error") {
              alert(response.txt);
            }
          });
        } catch (error) {
          alert('Something went wrong');
        }
      }
      else {
        alert('Company name can be upto 100 characters maximum');
      }
    }
    else {
      alert('Company name can not be empty');
    }
  }

  editCompany(name, id) {
    if (name != null && name.length > 0) {
      if (name.length < 100) {
        try {
          this.companyService.updateCompany({
            "company_name": name.trim(),
            "id": id
          }).subscribe(response => {
            if (response.status === "success") {
              alert('Company added');
              this.getCompanies();
            }
            else if (response.status === "error") {
              alert(response.txt);
            }
          });
        } catch (error) {
          alert('Something went wrong');
        }
      }
      else {
        alert('Company name can be upto 100 characters maximum');
      }
    }
    else {
      alert('Company name can not be empty');
    }
  }

  viewCompany(id) {
    this.navCtrl.navigateForward([`/home/companies/farms/${id}`]);
  }

  assignUser(id, mode) {
    this.navCtrl.navigateForward([`/home/companies/supassign/${id}/${mode}`]);
  }

  ionViewWillEnter() {
    this.getCompanies();
  }

  toProfile() {
    this.navCtrl.navigateForward(['/adminprofile']);
  }

  viewReport(id, name) {
    this.navCtrl.navigateForward([`/home/companies/reports/${id}/${name}`]);
  }

}