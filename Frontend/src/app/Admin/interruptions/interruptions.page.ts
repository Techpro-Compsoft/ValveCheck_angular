import { Component, OnInit } from '@angular/core';
import { CompanyService } from 'src/app/core/Services/Company/company.service';
import { BaseService } from 'src/app/core/Services/base.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-interruptions',
  templateUrl: './interruptions.page.html',
  styleUrls: ['./interruptions.page.scss'],
})
export class InterruptionsPage implements OnInit {

  interruptionReasons: Array<object>;

  constructor(private company: CompanyService, private base: BaseService,
    private alert: AlertController) { }

  ngOnInit() {
    this.getInterruprtionReasons();
  }

  getInterruprtionReasons() {
    try {
      this.company.getReasons().subscribe(response => {
        if (response.status === "success") {
          this.interruptionReasons = response.data;
        }
      });
    } catch (error) {
      this.base.toastMessage('Something went wrong');
    }
  }

  async openInterruptionDialog() {
    const alert = await this.alert.create({
      header: 'New Reason',
      inputs: [
        {
          name: 'reason',
          type: 'text',
          placeholder: 'Reason',
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
          text: 'ADD',
          handler: (data) => {
            this.createReason(data.reason);
          }
        }
      ]
    });
    await alert.present();
  }

  createReason(data: string) {
    if (data.length > 0 && data.length < 51) {
      try {
        this.company.addReason({ reason: data.trim().toLowerCase() }).subscribe(response => {
          if (response.status === "success") {
            this.getInterruprtionReasons();
          }
        });
      } catch (error) {
        this.base.toastMessage('Something went wrong');
      }
    }
    else {
      this.base.toastMessage('Reason should between 1-50 characters');
    }
  }

  async confirmationAlert(id){
    const alert = await this.alert.create({
      header: 'Confirm',
      message: 'Are you sure you want to delete?',
      buttons: [
        {
          text: 'NO',
          role: 'cancel',
          cssClass: 'test',
          handler: () => {
            // console.log('Confirm Cancel');
          }
        }, {
          text: 'YES',
          handler: (data) => {
            this.removeReason(id);
          }
        }
      ]
    });
    await alert.present();
  }

  removeReason(id) {
    try {
      this.company.deleteReason({ id: id }).subscribe(response => {
        if (response.status === "success") {
          this.getInterruprtionReasons();
        }
      });
    } catch (error) {
      this.base.toastMessage('Something went wrong');
    }
  }

}