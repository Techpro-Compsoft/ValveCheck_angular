import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SupervisorService } from 'src/app/core/Services/Supervisor/supervisor.service';
import { AlertController, NavController } from '@ionic/angular';
import { BaseService } from 'src/app/core/Services/base.service';

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
    public alertCtrl: AlertController,
    public base: BaseService,
    public navCtrl: NavController) { }

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
        if (response.status === 'success') {
          this.blocksList = response.data
        }
        else if (response.status === "error") {
          alert(response.txt);
        }
      });
    } catch (error) {
      this.base.toastMessage('Something went wrong');
    }
  }

  viewValves(id) {
    this.navCtrl.navigateForward([`/supervisor-dashboard/supervisor-blocktimings/${id}`]);


    // try {
    //   this.supervisorService.getCycleCall({
    //     "block": id
    //   }).subscribe(response => {
    //     if (response.data !== "") {
    //       if (response.data[0]['actual_stop_time'] !== null) {
    //         this.base.toastMessage('Already stopped');
    //       }
    //       else if (response.data[0]['actual_start_time'] == null) {
    //         this.base.toastMessage('Valve not started');
    //       }
    //       else {
    //         this.presentAlertConfirm(response.data[0]['id'])
    //       }
    //     }
    //     else {
    //       this.base.toastMessage('No data available');
    //     }
    //   });
    // } catch (error) {
    //   this.base.toastMessage('Something went wrong');
    // }
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
        if (response.status === 'success') {
          this.getBlockDetails();
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
