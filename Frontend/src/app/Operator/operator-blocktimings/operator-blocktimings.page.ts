import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OperatorService } from 'src/app/core/Services/Operator/operator.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-operator-blocktimings',
  templateUrl: './operator-blocktimings.page.html',
  styleUrls: ['./operator-blocktimings.page.scss'],
})
export class OperatorBlocktimingsPage implements OnInit {
  blockId: number;
  valveDetails: object;
  valveTime: number;
  startTime: string;
  endTime: string;

  constructor(public activatedRoute: ActivatedRoute,
    public operatorService: OperatorService,
    public alertCtrl: AlertController) { }

  ngOnInit() {
    this.blockId = +this.activatedRoute.snapshot.paramMap.get('blockId');
    this.getBlockValveDetails();
  }

  getBlockValveDetails() {
    try {
      this.operatorService.getCycleCall({
        block: this.blockId
      }).subscribe(response => {
        if (response.status === "success") {
          console.log(response);
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


  diff_hours(dt2, dt1) {
    var res = Math.abs(dt1 - dt2) / 1000;
    var hours = Math.floor(res / 3600) % 24;
    return hours;
  }

  startValve() {
    try {
      this.operatorService.openBlockCall({
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
      this.operatorService.closeBlockCall({
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
        this.operatorService.interruptBlockCall({
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
      this.operatorService.resumeBlockCall({
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
