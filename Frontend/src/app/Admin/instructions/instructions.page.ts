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
  constructor(public navCtrl: NavController,
    private pop: PopoverController, private base: BaseService) { }

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
          console.log(this.blocksArray);
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

}
