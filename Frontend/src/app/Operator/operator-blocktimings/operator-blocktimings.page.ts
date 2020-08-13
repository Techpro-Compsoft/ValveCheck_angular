import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OperatorService } from 'src/app/core/Services/Operator/operator.service';
import { AlertController } from '@ionic/angular';
import { BaseService } from 'src/app/core/Services/base.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { CompanyService } from 'src/app/core/Services/Company/company.service';

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
  latitude: any;
  longitude: any;
  interruptionReasons: Array<object>;

  valveHour: any;
  valveMins: any;

  stopTime: Date | string;

  constructor(public activatedRoute: ActivatedRoute,
    public operatorService: OperatorService,
    public alertCtrl: AlertController,
    public base: BaseService,
    private geolocation: Geolocation,
    private company: CompanyService) { }

  ngOnInit() {
    this.getInterruprtionReasons();
    this.blockId = +this.activatedRoute.snapshot.paramMap.get('blockId');
    this.latitude = this.activatedRoute.snapshot.paramMap.get('lat');
    this.longitude = this.activatedRoute.snapshot.paramMap.get('lng');
    this.getBlockValveDetails();

  }

  getInterruprtionReasons() {
    try {
      this.operatorService.getReasons().subscribe(response => {
        if (response.status === "success") {
          this.interruptionReasons = response.data;
        }
      });
    } catch (error) {
      this.base.toastMessage('Something went wrong');
    }
  }

  getLocation(id) {
    if (this.latitude == 'null' && this.longitude == 'null') {
      this.base.toastMessage('No coordinates available');
    }
    else if (this.latitude == "" && this.longitude == "") {
      this.base.toastMessage('No coordinates available');
    }
    else {
      this.geolocation.getCurrentPosition().then((resp) => {
        this.calculateDistance(resp.coords.latitude, resp.coords.longitude, id);
      }).catch((error) => {
        this.base.toastMessage('Error getting location');
      });
    }
  }

  calculateDistance(lat1: number, long1: number, id) {
    let p = 0.017453292519943295;    // Math.PI / 180
    let c = Math.cos;
    let a = 0.5 - c((lat1 - this.latitude) * p) / 2 + c(this.latitude * p) * c((lat1) * p) * (1 - c(((long1 - this.longitude) * p))) / 2;
    let dis = (12742 * Math.asin(Math.sqrt(a))); // 2 * R; R = 6371 km
    let distanceInMeters = dis * 1000; //distance in meters
    if (distanceInMeters <= 15) {

      if (id == 1) {
        this.startValveCall();
      }
      else if (id == 2) {
        this.stopValveCall();
      }
      else if (id == 3) {
        this.confirmReportCall();
      }
      else if (id == 4) {
        this.resumeValveCall();
      }
    }
    else {
      this.base.toastMessage('You are not nearby to valve. Please go to exact location');
    }
  }

  getBlockValveDetails() {
    try {
      this.operatorService.getCycleCall({
        block: this.blockId
      }).subscribe(response => {
        if (response.status === "success") {
          this.valveDetails = response.data ? response.data[0] : null;
          if (this.valveDetails && this.valveDetails['instruction']) {
            let time = this.valveDetails['instruction'].split(':');
            this.valveHour = parseInt(time[0]);
            this.valveMins = parseInt(time[1]);
            this.startTime = this.getDateT(this.valveDetails['instruction_start_time']);
            this.stopTime = this.getDateT(this.valveDetails['instruction_end_time']);
          }
        }
        else if (response.status === "error") {
          alert(response.txt);
        }
      });
    } catch (error) {
      this.base.toastMessage('something went wrong');
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

  startValve(id) {
    this.getLocation(id)
  }

  startValveCall() {
    try {
      this.operatorService.openBlockCall({
        id: this.valveDetails['id'],
        start_time: `${new Date().getHours()}:${new Date().getMinutes()}`
      }).subscribe(response => {
        if (response.status === "success") {
          this.getBlockValveDetails();
          this.base.toastMessage('Valve started');
        }
        else if (response.status === "error") {
          alert(response.txt);
        }
      });
    } catch (error) {
      this.base.toastMessage('Something went wrong');
    }
  }

  stopValve(id) {
    this.getLocation(id);
  }

  stopValveCall() {
    try {
      this.operatorService.closeBlockCall({
        id: this.valveDetails['id'],
        stop_time: `${new Date().getHours()}:${new Date().getMinutes()}`
      }).subscribe(response => {
        if (response.status === "success") {
          this.getBlockValveDetails();
          this.base.toastMessage('Valve stopped');
        }
        else if (response.status === "error") {
          alert(response.txt);
        }
      });
    } catch (error) {
      this.base.toastMessage('Something went wrong');
    }
  }

  confirmReport(id) {
    this.getLocation(id);
  }


  async confirmReportCall() {
    this.interruptionReasons.forEach((e: any) => {
      e.name = e.reason,
        e.type = 'radio',
        e.label = e.reason,
        e.value = e.reason,
        e.checked = false
    });
    this.interruptionReasons.forEach((e: any) => {
      e.name = e.reason,
        e.type = 'radio',
        e.label = e.reason,
        e.value = e.reason,
        e.checked = false
    });
    const alert = await this.alertCtrl.create();
    alert.inputs = this.interruptionReasons;
    alert.header = 'Confirm',
      alert.message = 'Please select the reason',
      alert.buttons = [
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
            this.reportValveIssue(data);
          }
        }
      ];
    await alert.present();

  }

  reportValveIssue(reason: string) {
    if (reason) {
      try {
        this.operatorService.interruptBlockCall({
          id: this.valveDetails['id'],
          time: `${new Date().getHours()}:${new Date().getMinutes()}`,
          interruption_reason: reason
        }).subscribe(response => {
          if (response.status === "success") {
            this.getBlockValveDetails();
            this.base.toastMessage('Valve issue has been reported');
          }
          else if (response.status === "error") {
            alert(response.txt);
          }
        });
      } catch (error) {
        this.base.toastMessage('something went wrong');
      }
    } else {
      this.base.toastMessage('Interruption Reason can not be empty');
      this.confirmReportCall();
    }
  }

  resumeValve(id) {
    this.getLocation(id)
  }

  resumeValveCall() {
    try {
      this.operatorService.resumeBlockCall({
        id: this.valveDetails['id'],
        start_time: `${new Date().getHours()}:${new Date().getMinutes()}`
      }).subscribe(response => {
        if (response.status === "success") {
          this.getBlockValveDetails();
          this.base.toastMessage('Valve resumed');
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
