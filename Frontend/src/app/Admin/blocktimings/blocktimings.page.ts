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
  startTime: string;
  endTime: string;

  constructor(private activatedRoute: ActivatedRoute, private farm: FarmService,
    private alertCtrl: AlertController, private nav: NavController) {
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
          this.valveDetails = response.data ? response.data[0] : null;
          this.valveTime = this.valveDetails ? parseInt(this.valveDetails['instruction']) : 1;
          this.startTime = this.valveDetails && this.valveDetails['instruction_start_time'] ? this.getDateT(this.valveDetails['instruction_start_time']) : '';
          this.endTime = this.valveDetails && this.valveDetails['instruction_end_time'] ? this.getDateT(this.valveDetails['instruction_end_time']) : '';
        }
      });
    } catch (error) {
      alert('something went wrong');
    }
  }

  getDateT(time: string): string {
    let d = time.split(":").map(e => +e);
    let b = new Date();
    return new Date(b.getFullYear(), b.getMonth(), b.getDate(), d[0], d[1]).toISOString();
  }

  assignTime(valveTime, st, end) {
    if (valveTime && st && end) {
      if (this.diff_hours(new Date(st), new Date(end)) === valveTime) {
        try {
          this.farm.assignHours({
            block: this.blockId,
            time: valveTime,
            start_time: `${new Date(st).getHours()}:${new Date(st).getMinutes()}`,
            end_time: `${new Date(end).getHours()}:${new Date(end).getMinutes()}`
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
      else {
        alert('Start & end time difference is more/less than valve hours');
      }

    } else {
      alert('Please fill all the details');
    }
  }

  diff_hours(dt2, dt1) {
    var res = Math.abs(dt1 - dt2) / 1000;
    var hours = Math.floor(res / 3600) % 24;
    return hours;
  }

  async presentAlertConfirm(valveTime, st, end) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Confirm',
      message: 'Are you sure you want to update this valve information?',
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
            this.updateTime(valveTime, st, end)
          }
        }
      ]
    });
    await alert.present();
  }

  updateTime(valveTime, st, end) {
    if (valveTime && st && end) {
      if (this.diff_hours(new Date(st), new Date(end)) === valveTime) {
        try {
          this.farm.updateHours({
            id: this.valveDetails['id'],
            time: valveTime,
            start_time: `${new Date(st).getHours()}:${new Date(st).getMinutes()}`,
            end_time: `${new Date(end).getHours()}:${new Date(end).getMinutes()}`
          }).subscribe(response => {
            if (response.status === "success") {
              this.getBlockValveDetails();
              alert('Time updated');
            }
          });
        } catch (error) {
          alert('something went wrong');
        }
      }
      else {
        alert('Start & end time difference is more/less than valve hours');
      }
    }
    else {
      alert('Please fill all the details');
    }
  }

  startValve() {
    try {
      this.farm.startValve({
        id: this.valveDetails['id'],
        start_time: `${new Date().getHours()}:${new Date().getMinutes()}`
      }).subscribe(response => {
        if (response.status === "success") {
          this.getBlockValveDetails();
          alert('Valve started');
        }
      });
    } catch (error) {
      alert('something went wrong');
    }
  }

  stopValve() {
    try {
      this.farm.stopValve({
        id: this.valveDetails['id'],
        stop_time: `${new Date().getHours()}:${new Date().getMinutes()}`
      }).subscribe(response => {
        if (response.status === "success") {
          this.getBlockValveDetails();
          alert('Valve stopped');
        }
      });
    } catch (error) {
      alert('something went wrong');
    }
  }

  async confirmReport() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Confirm',
      message: 'Please mention the issue for interruption caused.',
      inputs: [
        {
          name: 'reason',
          type: 'text',
          placeholder: 'Interruption reason',
        }
      ],
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
          handler: (data) => {
            this.reportValveIssue(data.reason);
          }
        }
      ]
    });
    await alert.present();
  }

  reportValveIssue(reason: string) {
    if (reason.trim() != "") {
      try {
        this.farm.reportIssue({
          id: this.valveDetails['id'],
          time: `${new Date().getHours()}:${new Date().getMinutes()}`,
          interruption_reason: reason
        }).subscribe(response => {
          if (response.status === "success") {
            this.getBlockValveDetails();
            alert('Valve issue reported');
          }
        });
      } catch (error) {
        alert('something went wrong');
      }
    } else {
      alert('Reason can not be empty');
      this.confirmReport();
    }

  }

  resumeValve() {
    try {
      this.farm.resumeValve({
        id: this.valveDetails['id'],
        start_time: `${new Date().getHours()}:${new Date().getMinutes()}`
      }).subscribe(response => {
        if (response.status === "success") {
          this.getBlockValveDetails();
          alert('Valve resumed');
        }
      });
    } catch (error) {
      alert('something went wrong');
    }
  }

}