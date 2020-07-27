import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CompanyService } from '../core/Services/Company/company.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-farms',
  templateUrl: './farms.page.html',
  styleUrls: ['./farms.page.scss'],
})
export class FarmsPage implements OnInit {

  companyId: number;
  farmsList: Array<object>;

  constructor(private route: ActivatedRoute, private service: CompanyService, private alertCtlr: AlertController) { }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      this.companyId = parseInt(params.get('id'));
      this.getCompanyFarms();
    });
  }

  getCompanyFarms() {
    try {
      this.service.getFarmsForCompany({ id: this.companyId }).subscribe(response => {
        if (response.status === "success") {
          this.farmsList = [];
          this.farmsList = response.data.farms;
        }
      })
    } catch (error) {
      alert('Something went wrong');
    }
  }

  async openFarmDialog(value?, id?) {
    const alert = await this.alertCtlr.create({
      cssClass: 'my-custom-class',
      header: value ? 'Edit Farm' : 'New Farm',
      inputs: [
        {
          name: 'name1',
          type: 'text',
          placeholder: 'Farm Name',
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
        this.service.createFarm({
          "company": this.companyId,
          "farm_name": name.trim()
        }).subscribe(response => {
          if (response.status === "success") {
            alert('Farm added');
            this.getCompanyFarms();
          }
        })
      } catch (error) {
        alert('Something went wrong');
      }
    }
  }

  editCompany(name, id) {
    // if (name != null && name.length > 0) {
    //   try {
    //     this.companyService.updateCompany({
    //       "company_name": name.trim(),
    //       "id": id
    //     }).subscribe(response => {
    //       if (response.status === "success") {
    //         alert('Company added');
    //         this.getCompanies();
    //       }
    //     })
    //   } catch (error) {
    //     alert('Something went wrong');
    //   }
    // }
  }



}
