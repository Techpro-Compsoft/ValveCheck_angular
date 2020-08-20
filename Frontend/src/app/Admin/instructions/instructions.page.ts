import { Component, OnInit } from '@angular/core';
import { NavController, PopoverController } from '@ionic/angular';
import { PopoverComponent } from '../popover/popover.component';
import { BaseService } from 'src/app/core/Services/base.service';

@Component({
  selector: 'app-instructions',
  templateUrl: './instructions.page.html',
  styleUrls: ['./instructions.page.scss'],
})
export class InstructionsPage implements OnInit {

  blocksArray: Array<object>;
  currentDate: Date;

  constructor(public navCtrl: NavController,
    private pop: PopoverController, private base: BaseService) {
      this.currentDate = new Date();
     }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getBlocks();
  }

  getBlocks() {
    try {
      this.base.getAllBlocks({ role: 1 }).subscribe(response => {
        if (response.status === "success") {
          this.blocksArray = response.data;
          this.blocksArray.forEach(e => {
            e['expected_stop_time'] = null;
            if (e['instruction'] && e['actual_start_time']) {
              const d = new Date();
              let t = e['actual_start_time'].split(":");
              let endTime = new Date(d.getFullYear(), d.getMonth(), d.getDate(), parseInt(t[0]), parseInt(t[1]));
              let instTime = e['instruction'].split(":")
              endTime.setHours(endTime.getHours() + parseInt(instTime[0]));
              endTime.setMinutes(endTime.getMinutes() + parseInt(instTime[1]));
              e['expected_stop_time'] = `${endTime.getHours()}:${endTime.getMinutes()}:00`;
              if (e['actual_stop_time']) {
                let actStop = e['actual_stop_time'].split(":");
                if (endTime.getHours() === parseInt(actStop[0]) && endTime.getMinutes() === parseInt(actStop[1])) {
                  e['onTime'] = true;
                }
                else {
                  e['onTime'] = false;
                }
              }
            }
          });
        }
      })
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

}
