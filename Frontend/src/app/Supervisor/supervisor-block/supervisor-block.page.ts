import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SupervisorService } from 'src/app/core/Services/Supervisor/supervisor.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-supervisor-block',
  templateUrl: './supervisor-block.page.html',
  styleUrls: ['./supervisor-block.page.scss'],
})
export class SupervisorBlockPage implements OnInit {
  farmId: number;
  role: any;
  blocksList: Array<object>;
  valveDetails: object;

  constructor(public activatedRoute: ActivatedRoute,
    public supervisorService: SupervisorService,
    public alertCtrl: AlertController) { }

  ngOnInit() {
    this.farmId = +this.activatedRoute.snapshot.paramMap.get('farmId');
    let data = JSON.parse(localStorage.getItem('myUser'));
    this.role = data.role;
    this.getBlockDetails()
  }

  getBlockDetails() {
    try {
      this.supervisorService.getBlockDetailsCall({
        "farm": this.farmId,
        "role": this.role
      }).subscribe(response => {
        console.log(response);
        this.blocksList = response.data
      });
    } catch (error) {
      alert('something went wrong')
    }
  }

  viewValves(id) {
    try {
      this.supervisorService.getCycleCall({
        "block": id
      }).subscribe(response => {
        console.log(response);
        if (response.data !== "") {
          if (response.data[0]['actual_stop_time'] !== null) {
            alert('already stopped')
          }
          else if (response.data[0]['actual_start_time'] == null) {
            alert('valve not started')
          }
          else {
            this.presentAlertConfirm(response.data[0]['id'])
          }
        }
        else {
          alert('No data available')
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
    var d = new Date();
    var h = d.getHours();
    var m = d.getMinutes();
    let timeStamp = h + ':' + m;
    try {
      this.supervisorService.closeBlockCall({
        "id": id,
        "stop_time": timeStamp
      }).subscribe(response => {
        console.log(response);
        this.getBlockDetails();
      });
    } catch (error) {
      alert('something went wrong')
    }
  }


}
