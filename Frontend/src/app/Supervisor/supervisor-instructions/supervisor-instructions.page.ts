import { Component, OnInit } from '@angular/core';
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

  constructor(public base: BaseService,
    public navCtrl: NavController,
    public router: Router) {
    this.currentDate = new Date();
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getBlocks();
  }

  getBlocks() {
    try {
      this.base.getAllBlocks({ role: 2 }).subscribe(response => {
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

  openProfilePage() {
    this.navCtrl.navigateForward(['/supervisor-profile'])
  }


  viewValves(id) {
    this.navCtrl.navigateForward([`/supervisor-blocktimings/${id}`]);
  }







}
