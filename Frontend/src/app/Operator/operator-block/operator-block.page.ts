import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OperatorService } from 'src/app/core/Services/Operator/operator.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-operator-block',
  templateUrl: './operator-block.page.html',
  styleUrls: ['./operator-block.page.scss'],
})
export class OperatorBlockPage implements OnInit {
  farmId: number;
  role: any;
  blocksList: Array<object>;
  instructionData: Array<object>;
  blockId: number;
  timeCheckBool: boolean = true;
  checkTimeId: number;
  resumeInterruptBool: boolean = false;

  constructor(public activatedRoute: ActivatedRoute,
    public operatorService: OperatorService,
    public alertCtrl: AlertController) { }

  ngOnInit() {
    this.farmId = +this.activatedRoute.snapshot.paramMap.get('farmId');
    let data = JSON.parse(localStorage.getItem('myUser'));
    this.role = data.role;
    this.getBlockDetails()
  }

  getBlockDetails() {
    this.operatorService.getBlockDetailsCall({
      "farm": this.farmId,
      "role": this.role
    }).subscribe(response => {
      console.log(response);
      this.blocksList = response.data
      this.blockId = response.data[0]['id'];
      this.getCycle();
    });
  }

  getCycle() {
    this.operatorService.getCycleCall({
      "block": this.blockId
    }).subscribe(response => {
      console.log(response);
      this.checkTimeId = response.data[0]['id']
      this.instructionData = response.data
    })
  }

  startTime() {
    var x = new Date();
    var h = x.getHours();
    var m = x.getMinutes();
    let startTime = h + ':' + m;
    this.operatorService.openBlockCall({
      "id": this.checkTimeId,
      "start_time": startTime
    }).subscribe(response => {
      console.log(response);
      if (response.status = "success") {
        this.timeCheckBool = false;
        this.getCycle();
      }
    });
  }

  endTime() {
    var x = new Date();
    var h = x.getHours();
    var m = x.getMinutes();
    let endTime = h + ':' + m;
    this.operatorService.closeBlockCall({
      "id": this.checkTimeId,
      "stop_time": endTime
    }).subscribe(response => {
      if (response.status == "success") {
        this.getCycle();
      }
    });
  }

  async openInterruption() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Interruption ',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Reason',
          value: ''
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'EDIT',
          handler: (data) => {
            this.submitInterruption(data)
          }
        }
      ]
    });
    await alert.present();
  }




  submitInterruption(data) {
    var x = new Date();
    var h = x.getHours();
    var m = x.getMinutes();
    let interruptTime = h + ':' + m;
    this.operatorService.interruptBlockCall({
      "id": this.checkTimeId,
      "time": interruptTime,
      "interruption_reason": data.name
    }).subscribe(response => {
      console.log(response);
      if (response.status == "success") {
        this.resumeInterruptBool = true;
        this.getCycle();
      }
    });
  }

  resumeInterruption() {
    var x = new Date();
    var h = x.getHours();
    var m = x.getMinutes();
    let interruptTime = h + ':' + m;
    this.operatorService.resumeBlockCall({
      "id": this.checkTimeId,
      "start_time": interruptTime,
    }).subscribe(response => {
      console.log(response);
      if (response.status == "success") {
        this.resumeInterruptBool = false;
        this.getCycle();
      }
    });
  }

}
