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
  operatorId: number;
  valveDetails: object;

  startTime: Date | string;
  endTime: Date | string;

  valveHour: any;
  valveMins: any;

  hoursArr: any[] = [];
  minsArray: any[] = [];

  constructor(private activatedRoute: ActivatedRoute, private farm: FarmService,
    private alertCtrl: AlertController, private nav: NavController) {
    for (let index = 1; index < 11; index++) {
      this.hoursArr.push(index);
    }
    for (let index = 0; index < 60; index++) {
      this.minsArray.push(index);
    }
  }

  ngOnInit() {
    this.blockId = +this.activatedRoute.snapshot.paramMap.get('id');
    this.operatorId = +this.activatedRoute.snapshot.paramMap.get('operatorId');
    this.getBlockValveDetails();
  }

  getBlockValveDetails() {
    try {
      this.farm.valveDetails({
        block: this.blockId
      }).subscribe(response => {
        // console.log(response);
        if (response.status === "success") {
          this.valveDetails = response.data ? response.data[0] : null;
          if (this.valveDetails && this.valveDetails['instruction']) {
            let time = this.valveDetails['instruction'].split(':');
            this.valveHour = parseInt(time[0]);
            this.valveMins = parseInt(time[1]);
            this.startTime = this.getDateT(this.valveDetails['instruction_start_time']);
          }
        }
        else if (response.status === "error") {
          alert(response.txt);
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

  assignTime() {
    if (this.valveHour && (this.valveMins || this.valveMins === 0) && this.startTime) {
      let endTime = new Date(this.startTime);
      endTime.setHours(endTime.getHours() + this.valveHour);
      endTime.setMinutes(endTime.getMinutes() + this.valveMins);
      try {
        this.farm.assignHours({
          block: this.blockId,
          time: `${this.valveHour}:${this.valveMins}`,
          start_time: `${new Date(this.startTime).getHours()}:${new Date(this.startTime).getMinutes()}`,
          end_time: `${endTime.getHours()}:${endTime.getMinutes()}`,
          operator: this.operatorId
        }).subscribe(response => {
          if (response.status === "success") {
            this.getBlockValveDetails();
            alert('Time added');
          }
          else if (response.status === "error") {
            alert(response.txt);
          }
        });
      } catch (error) {
        alert('something went wrong');
      }
    }
    else {
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
            this.updateTime();
          }
        }
      ]
    });
    await alert.present();
  }

  updateTime() {
    if (this.valveHour && this.valveMins && this.startTime) {
      let endTime = new Date(this.startTime);
      endTime.setHours(endTime.getHours() + this.valveHour);
      endTime.setMinutes(endTime.getMinutes() + this.valveMins);
      try {
        this.farm.updateHours({
          id: this.valveDetails['id'],
          time: `${this.valveHour}:${this.valveMins}`,
          start_time: `${new Date(this.startTime).getHours()}:${new Date(this.startTime).getMinutes()}`,
          end_time: `${endTime.getHours()}:${endTime.getMinutes()}`
        }).subscribe(response => {
          if (response.status === "success") {
            this.getBlockValveDetails();
            alert('Time updated');
          }
          else if (response.status === "error") {
            alert(response.txt);
          }
        });
      } catch (error) {
        alert('something went wrong');
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
        else if (response.status === "error") {
          alert(response.txt);
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
        else if (response.status === "error") {
          alert(response.txt);
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
          else if (response.status === "error") {
            alert(response.txt);
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
        else if (response.status === "error") {
          alert(response.txt);
        }
      });
    } catch (error) {
      alert('something went wrong');
    }
  }


}