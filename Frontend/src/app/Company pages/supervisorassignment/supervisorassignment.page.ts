import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CompanyService } from 'src/app/core/Services/Company/company.service';
import { SupervisorService } from 'src/app/core/Services/Supervisor/supervisor.service';
import { AlertController } from '@ionic/angular';
import { BaseService } from 'src/app/core/Services/base.service';

@Component({
  selector: 'app-supervisorassignment',
  templateUrl: './supervisorassignment.page.html',
  styleUrls: ['./supervisorassignment.page.scss'],
})
export class SupervisorassignmentPage implements OnInit {

  compId: any;
  companyDetails: any;
  usersList: Array<object>;
  modeId: number;
  assignedUsers: Array<object>;

  constructor(private activatedRoute: ActivatedRoute, private companyService: CompanyService,
    private supService: SupervisorService, private alertCtrl: AlertController,
    private base: BaseService) { }

  ngOnInit() {
    this.compId = +this.activatedRoute.snapshot.paramMap.get('compId');
    this.modeId = +this.activatedRoute.snapshot.paramMap.get('mode');
  }

  ionViewWillEnter() {
    this.getCompanyDetails();
    this.getUsers();
  }

  getCompanyDetails() {
    try {
      this.companyService.getFarmsForCompany({ id: this.compId }).subscribe(response => {
        if (response.status === "success") {
          this.companyDetails = response.data.company;
          this.assignedUsers = this.modeId === 1 ? response.data.supervisor : response.data.operator;
          this.assignedUsers.sort((a, b) => (a['fullname'].toLowerCase() > b['fullname'].toLowerCase()) ? 1 : ((b['fullname'].toLowerCase() > a['fullname'].toLowerCase()) ? -1 : 0));
        }
      })
    } catch (error) {
      this.base.toastMessage('Something went wrong');
    }
  }

  getUsers() {
    try {
      this.supService.getUsers({ role: this.modeId === 1 ? 2 : 3 }).subscribe(response => {
        if (response.status === "success") {
          this.usersList = response.data;
        }
        else if (response.status === "error") {
          alert(response.txt);
        }
      });
    } catch (error) {
      this.base.toastMessage('Something went wrong');
    }
  }

  assignSupervisor(vl) {
    try {
      this.supService.assignRole({
        "company": this.compId,
        "user_id": vl.value,
        "role": this.modeId === 1 ? 2 : 3
      }).subscribe(response => {
        if (response.status === "success") {
          this.base.toastMessage('Assigned successfully');
          vl.value = '';
          this.getCompanyDetails();
          this.getUsers();
        }
        else if (response.status === "error") {
          alert(response.txt);
        }
      });
    } catch (error) {
      this.base.toastMessage('Something went wrong');
    }
  }
  //2 for supervisor

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
            this.removeRole(userId)
          }
        }
      ]
    });
    await alert.present();
  }

  removeRole(userId) {
    try {
      this.supService.removeRole({
        "company": this.compId,
        "user_id": userId,
        "role": this.modeId === 1 ? 2 : 3
      }).subscribe(response => {
        if (response.status === "success") {
          this.base.toastMessage('Removed successfully');
          this.getCompanyDetails();
          this.getUsers();
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