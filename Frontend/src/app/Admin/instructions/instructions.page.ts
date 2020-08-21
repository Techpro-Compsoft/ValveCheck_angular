import { Component, OnInit, NgZone } from '@angular/core';
import { NavController, PopoverController } from '@ionic/angular';
import { PopoverComponent } from '../popover/popover.component';
import { BaseService } from 'src/app/core/Services/base.service';

@Component({
  selector: 'app-instructions',
  templateUrl: './instructions.page.html',
  styleUrls: ['./instructions.page.scss'],
})
export class InstructionsPage implements OnInit {

  blocksArray: Array<object> = [];
  currentDate: Date;

  startIndex: number;
  itemCount: number;
  endIndex: number;
  infinteLoad = true;
  arr2: Array<object>;

  constructor(public navCtrl: NavController, private zone: NgZone,
    private pop: PopoverController, private base: BaseService) {
    this.currentDate = new Date();
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.startIndex = 0;
    this.itemCount = 10;
    this.endIndex = 10;
    this.getBlocks();
  }

  loadData(event?) {
    if (this.endIndex > this.arr2.length) {
      this.endIndex = this.arr2.length;
    }
    if (this.startIndex != this.endIndex) {
      for (let i = this.startIndex; i < this.endIndex; i++) {
        if (this.arr2[i]) {
          this.arr2[i]['expected_stop_time'] = null;
          if (this.arr2[i]['instruction'] && this.arr2[i]['actual_start_time']) {
            const d = new Date();
            let t = this.arr2[i]['actual_start_time'].split(":");
            let endTime = new Date(d.getFullYear(), d.getMonth(), d.getDate(), parseInt(t[0]), parseInt(t[1]));
            let instTime = this.arr2[i]['instruction'].split(":")
            endTime.setHours(endTime.getHours() + parseInt(instTime[0]));
            endTime.setMinutes(endTime.getMinutes() + parseInt(instTime[1]));
            this.arr2[i]['expected_stop_time'] = `${endTime.getHours()}:${endTime.getMinutes()}:00`;
            if (this.arr2[i]['actual_stop_time']) {
              let actStop = this.arr2[i]['actual_stop_time'].split(":");
              if (endTime.getHours() === parseInt(actStop[0]) && endTime.getMinutes() === parseInt(actStop[1])) {
                this.arr2[i]['onTime'] = true;
              }
              else {
                this.arr2[i]['onTime'] = false;
              }
            }
          }
          this.blocksArray.push(this.arr2[i]);
        }
      }
      this.startIndex = this.endIndex;
      if (this.endIndex + this.itemCount > this.arr2.length) {
        this.endIndex = this.endIndex + this.arr2.length - this.endIndex;
      }
      else {
        this.endIndex = this.endIndex + this.itemCount;
      }
      if (event) {
        event.target.complete();
      }
    }
    else {
      this.infinteLoad = false;
    }
  }

  doInfinite(event) {
    this.loadData(event);
  }

  getBlocks() {
    try {
      this.base.getAllBlocks({ role: 1 }).subscribe(response => {
        if (response.status === "success" && response.data.length > 0) {
          this.infinteLoad = true;
          this.zone.run(() => {
            this.arr2 = response.data;
            this.blocksArray = [];
          });
          this.loadData();
        }
      });
    } catch (error) {
      this.base.toastMessage('Something went wrong');
    }
  }

  async presentPopover(ev: any) {
    const popover = await this.pop.create({
      component: PopoverComponent,
      cssClass: 'testPop',
      event: ev,
      translucent: true
    });
    return await popover.present();
  }

  testFn(index: number, item: any): number {
    return item.id;
  }

}