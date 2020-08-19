import { Component, OnInit } from '@angular/core';
import { NavController, PopoverController } from '@ionic/angular';
import { PopoverComponent } from '../popover/popover.component';

@Component({
  selector: 'app-instructions',
  templateUrl: './instructions.page.html',
  styleUrls: ['./instructions.page.scss'],
})
export class InstructionsPage implements OnInit {

  constructor(public navCtrl: NavController,
    private pop: PopoverController) { }

  ngOnInit() {
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
