import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FarmService } from 'src/app/core/Services/Farm/farm.service';
import { CompanyService } from 'src/app/core/Services/Company/company.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-assignfarm',
  templateUrl: './assignfarm.page.html',
  styleUrls: ['./assignfarm.page.scss'],
})
export class AssignfarmPage implements OnInit {

  farmId: number;
  modeId: number;
  companyId: number;
  availableUsers: Array<object>;
  assignedUsers: Array<object>;
  farmName: string;

  constructor(private activatedRoute: ActivatedRoute, private farmService: FarmService,
    private companyService: CompanyService, private alertCtrl: AlertController) { }

  ngOnInit() {
    this.farmId = +this.activatedRoute.snapshot.paramMap.get('farmId');
    this.modeId = +this.activatedRoute.snapshot.paramMap.get('mode');
    this.companyId = +this.activatedRoute.snapshot.paramMap.get('compId');
    this.getFarmDetails();
  }

  getCompanyDetails() {
    try {
      this.companyService.getFarmsForCompany({ id: this.companyId }).subscribe(response => {
        if (response.status === "success") {
          this.availableUsers = [];
          const data = this.modeId === 1 ? response.data.supervisor : response.data.operator;
          this.availableUsers = data.filter(ar => !this.assignedUsers.find(rm => (rm['id'] === ar['id'])));
        }
      });
    } catch (error) {
      alert('Something went wrong');
    }
  }

  getFarmDetails() {
    try {
      this.farmService.farmDetails({ id: this.farmId }).subscribe(response => {
        if (response.status === "success") {
          this.assignedUsers = this.modeId === 1 ? response.data.supervisor : response.data.operator;
          this.getCompanyDetails();
          this.farmName = response.data.farm.farm_name;
        }
      });
    } catch (error) {
      alert('Something went wrong');
    }
  }

  assignToFarm(sl) {
    if (this.availableUsers.length > 0 && sl.value != undefined) {
      try {
        this.farmService.assignToFarm({
          farm: this.farmId,
          user_id: sl.value,
          role: this.modeId === 1 ? 2 : 3
        }).subscribe(response => {
          if (response.status === "success") {
            sl.value = '';
            this.getFarmDetails();
            this.getCompanyDetails();
          }
        })
      } catch (error) {
        alert('Something went wrong');
      }
    } else {
      alert('No user selected');
    }
  }

  async presentAlertConfirm(userId) {
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
            this.removeRFromFarm(userId)
          }
        }
      ]
    });

    await alert.present();
  }

  removeRFromFarm(userId) {
    try {
      this.farmService.removeUserFromFarm({
        "farm": this.farmId,
        "user_id": userId,
        "role": this.modeId === 1 ? 2 : 3
      }).subscribe(response => {
        if (response.status === "success") {
          alert('Removed');
          this.getFarmDetails();
        }
      });
    } catch (error) {
      alert('Something went wrong');
    }
  }

}