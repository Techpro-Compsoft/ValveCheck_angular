import { Component } from '@angular/core';
import { CompanyService } from '../core/Services/Company/company.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  companiesList: Array<object>;

  constructor(private companyService: CompanyService, private alertCtlr: AlertController,
    private router: Router) {
  }

  ngOnInit() {
    this.getCompanies();
  }

  getCompanies() {
    try {
      this.companyService.fetchCompanies().subscribe(response => {
        if (response.status === "success") {
          this.companiesList = [];
          this.companiesList = response.data;
        }
      })
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
      try {
        this.companyService.createCompany({
          "company_name": name.trim()
        }).subscribe(response => {
          if (response.status === "success") {
            alert('Company added');
            this.getCompanies();
          }
        })
      } catch (error) {
        alert('Something went wrong');
      }
    }
  }

  editCompany(name, id) {
    if (name != null && name.length > 0) {
      try {
        this.companyService.updateCompany({
          "company_name": name.trim(),
          "id": id
        }).subscribe(response => {
          if (response.status === "success") {
            alert('Company added');
            this.getCompanies();
          }
        })
      } catch (error) {
        alert('Something went wrong');
      }
    }
  }

  viewCompany(id) {
    this.router.navigate(['/farms', { queryParams: { id: id } }]);
  }

}
