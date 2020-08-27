import { Component, OnInit, NgZone } from '@angular/core';
import { BaseService } from 'src/app/core/Services/base.service';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-supervisor-instructions',
  templateUrl: './supervisor-instructions.page.html',
  styleUrls: ['./supervisor-instructions.page.scss'],
})
export class SupervisorInstructionsPage implements OnInit {
  blocksArray: Array<object>;
  currentDate: Date;

  startIndex: number;
  itemCount: number;
  endIndex: number;
  infinteLoad = true;
  arr2: Array<object>;

  constructor(public base: BaseService,
    public navCtrl: NavController,
    public router: Router,
    private zone: NgZone) {
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
    try {
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
              this.arr2[i]['expected_stop_time'] = `${endTime.getHours()}:${endTime.getMinutes()}`;
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
    } catch (error) {
      alert('something went wrong while loading data');
    }
  }

  doInfinite(event) {
    this.loadData(event);
  }

  getBlocks() {
    try {
      this.base.getAllBlocks({ role: 2 }).subscribe(response => {
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


  testFn(index: number, item: any): number {
    return item.id;
  }


  openProfilePage() {
    this.navCtrl.navigateForward(['/supervisor-profile'])
  }


  viewValves(id) {
    this.navCtrl.navigateForward([`/supervisor-blocktimings/${id}`]);
  }

}
