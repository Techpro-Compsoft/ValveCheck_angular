import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SupervisorService } from 'src/app/core/Services/Supervisor/supervisor.service';
import { AlertController } from '@ionic/angular';
import { BaseService } from 'src/app/core/Services/base.service';

@Component({
  selector: 'app-supervisor-blocktimings',
  templateUrl: './supervisor-blocktimings.page.html',
  styleUrls: ['./supervisor-blocktimings.page.scss'],
})
export class SupervisorBlocktimingsPage implements OnInit {

  blockId: number;
  valveDetails: object;


  constructor(public activatedRoute: ActivatedRoute,
    public supervisorService: SupervisorService,
    public alertCtrl: AlertController,
    public base: BaseService) { }

  ngOnInit() {
    this.blockId = +this.activatedRoute.snapshot.paramMap.get('blockId');
    this.getValveDetails();
  }

  getValveDetails() {
    try {
      this.supervisorService.getCycleCall({
        "block": this.blockId
      }).subscribe(response => {
        if (response.status === 'success') {
          if (response.data == "") {
            this.base.toastMessage('No data available');
          }
          else {
            this.valveDetails = response.data[0];
          }
        }
        else if (response.status === "error") {
          alert(response.txt);
        }
      });
    } catch (error) {
      this.base.toastMessage('Something went wrong');
    }
  }

  async presentAlertConfirm(id) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Confirm',
      message: 'Do you want to stop valve?',
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
            this.closeBlock(id);
          }
        }
      ]
    });
    await alert.present();
  }

  closeBlock(id) {
    try {
      this.supervisorService.closeBlockCall({
        "id": id,
        "stop_time": `${new Date().getHours()}:${new Date().getMinutes()}`,
      }).subscribe(response => {
        if (response.status === 'success') {
          this.base.toastMessage('Valve stopped successfully');
          this.getValveDetails();
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
