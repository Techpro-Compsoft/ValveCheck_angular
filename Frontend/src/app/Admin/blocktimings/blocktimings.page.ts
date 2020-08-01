import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { FarmService } from 'src/app/core/Services/Farm/farm.service';

@Component({
  selector: 'app-blocktimings',
  templateUrl: './blocktimings.page.html',
  styleUrls: ['./blocktimings.page.scss'],
})
export class BlocktimingsPage implements OnInit {

  blockId: number;
  valveDetails: object;
  valveTime: number;

  constructor(private activatedRoute: ActivatedRoute, private farm: FarmService,
    private alertCtrl: AlertController, private nav: NavController) {
    this.valveTime = 1;
  }

  ngOnInit() {
    this.blockId = +this.activatedRoute.snapshot.paramMap.get('id');
    this.getBlockValveDetails();
  }

  getBlockValveDetails() {
    try {
      this.farm.valveDetails({
        block: this.blockId
      }).subscribe(response => {
        if (response.status === "success") {
          this.valveDetails = response.data[0];
          this.valveTime = this.valveDetails['instruction'] ? parseInt(this.valveDetails['instruction']) : 1;
        }
      });
    } catch (error) {
      alert('something went wrong');
    }
  }

  assignTime(valveTime) {
    if (valveTime) {
      try {
        this.farm.assignHours({
          block: this.blockId,
          time: valveTime
        }).subscribe(response => {
          if (response.status === "success") {
            this.getBlockValveDetails();
            alert('Time added');
          }
        })
      } catch (error) {
        alert('something went wrong');
      }
    }
  }

  async presentAlertConfirm(valveTime) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Confirm',
      message: 'Are you sure you want to update this valve time?',
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
            this.updateTime(valveTime)
          }
        }
      ]
    });
    await alert.present();
  }

  updateTime(valveTime) {
    if (valveTime) {
      try {
        this.farm.updateHours({
          id: this.valveDetails['id'],
          time: valveTime
        }).subscribe(response => {
          if (response.status === "success") {
            this.getBlockValveDetails();
            alert('Time updated');
          }
        })
      } catch (error) {
        alert('something went wrong');
      }
    }
  }

}