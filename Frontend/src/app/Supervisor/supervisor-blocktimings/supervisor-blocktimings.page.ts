import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SupervisorService } from 'src/app/core/Services/Supervisor/supervisor.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-supervisor-blocktimings',
  templateUrl: './supervisor-blocktimings.page.html',
  styleUrls: ['./supervisor-blocktimings.page.scss'],
})
export class SupervisorBlocktimingsPage implements OnInit {

  blockId: number;
  valveDetails: object;
  startTime: string;
  endTime: string

  constructor(public activatedRoute: ActivatedRoute,
    public supervisorService: SupervisorService,
    public alertCtrl: AlertController) { }

  ngOnInit() {
    this.blockId = +this.activatedRoute.snapshot.paramMap.get('blockId');
    this.getValveDetails();
  }

  getValveDetails() {
    try {
      this.supervisorService.getCycleCall({
        "block": this.blockId
      }).subscribe(response => {
        if (response.data == "") {
          alert('No data available')
        }
        else {
          this.valveDetails = response.data[0];
          this.startTime = this.valveDetails['instruction_start_time'];
          this.endTime = this.valveDetails['instruction_end_time']
        }
      });
    } catch (error) {
      alert('something went wrong')
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
        console.log(response);
        this.getValveDetails();
      });
    } catch (error) {
      alert('something went wrong')
    }
  }



}
