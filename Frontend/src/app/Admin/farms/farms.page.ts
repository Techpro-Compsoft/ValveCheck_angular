import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CompanyService } from '../../core/Services/Company/company.service';
import { AlertController, NavController } from '@ionic/angular';
import { FarmService } from '../../core/Services/Farm/farm.service';
import { BaseService } from 'src/app/core/Services/base.service';

@Component({
  selector: 'app-farms',
  templateUrl: './farms.page.html',
  styleUrls: ['./farms.page.scss'],
})
export class FarmsPage implements OnInit {

  companyId: number;
  farmsList: Array<object>;

  constructor(private activatedRoute: ActivatedRoute,
    private companyService: CompanyService, private alertCtlr: AlertController,
    private farmService: FarmService, public navCtrl: NavController,
    private base : BaseService) { }

  ngOnInit() {
    this.companyId = +this.activatedRoute.snapshot.paramMap.get('selectedId');
    this.getCompanyFarms();
  }

  getCompanyFarms() {
    try {
      this.companyService.getFarmsForCompany({ id: this.companyId }).subscribe(response => {
        if (response.status === "success") {
          this.farmsList = response.data.farms;
        }
        else if (response.status === "error") {
          alert(response.txt);
        }
      });
    } catch (error) {
      this.base.toastMessage('Something went wrong');
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
            // console.log('Confirm Cancel');
          }
        }, {
          text: value ? 'EDIT' : 'ADD',
          handler: (data) => {
            value ? this.editFarm(data.name1, id) : this.createFarm(data.name1);
          }
        }
      ]
    });
    await alert.present();
  }

  createFarm(name: string) {
    if (name != null && name.length > 0) {
      try {
        this.farmService.createFarm({
          "company": this.companyId,
          "farm_name": name.trim()
        }).subscribe(response => {
          if (response.status === "success") {
            this.base.toastMessage('Farm added');
            this.getCompanyFarms();
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
      this.base.toastMessage('Farm name can not be empty');
    }
  }

  editFarm(name, id) {
    if (name != null && name.length > 0) {
      try {
        this.farmService.updateFarm({
          "id": id,
          "company": this.companyId,
          "farm_name": name
        }).subscribe(response => {
          if (response.status === "success") {
            this.base.toastMessage('Farm updated');
            this.getCompanyFarms();
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
      this.base.toastMessage('Farm name can not be empty');
    }
  }

  viewBlocks(id) {
    this.navCtrl.navigateForward([`/home/companies/farms/${this.companyId}/blocks/${id}`]);
  }

  viewFarmDetails(farmId, mode) {
    this.navCtrl.navigateForward([`/home/companies/farms/${this.companyId}/assigntofarm/${farmId}/${mode}/${this.companyId}`]);
  }

}