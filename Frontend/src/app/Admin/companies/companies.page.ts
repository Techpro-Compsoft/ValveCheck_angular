import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../../core/Services/Company/company.service';
import { AlertController, NavController, PopoverController } from '@ionic/angular';
import { BaseService } from 'src/app/core/Services/base.service';
import { ActivatedRoute } from '@angular/router';
import { PopoverComponent } from '../popover/popover.component';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.page.html',
  styleUrls: ['./companies.page.scss'],
})
export class CompaniesPage implements OnInit {

  companiesList: Array<object>;

  constructor(private companyService: CompanyService, private base: BaseService,
    private alertCtlr: AlertController, public navCtrl: NavController,
    private pop: PopoverController ) { }

  ngOnInit() {
  }

  getCompanies() {
    try {
      this.companyService.fetchCompanies().subscribe(response => {
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
          cssClass: 'test',
          handler: () => {
            // console.log('Confirm Cancel');
          }
        }, {
          text: value ? 'UPDATE' : 'ADD',
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
              this.base.toastMessage('Company added');
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
      else {
        this.base.toastMessage('Company name can be upto 100 characters maximum');
      }
    }
    else {
      this.base.toastMessage('Company name can not be empty');
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
              this.base.toastMessage('Company updated');
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
      else {
        this.base.toastMessage('Company name can be upto 100 characters maximum');
      }
    }
    else {
      this.base.toastMessage('Company name can not be empty');
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

  viewReport(id, name) {
    this.navCtrl.navigateForward([`/home/companies/reports/${id}/${name}`]);
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