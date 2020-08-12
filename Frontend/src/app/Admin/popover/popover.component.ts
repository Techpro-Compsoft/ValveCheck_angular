import { Component, OnInit } from '@angular/core';
import { NavController, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {

  constructor(private navCtrl: NavController, private pop: PopoverController) { }

  ngOnInit() { }

  toProfile() {
    this.navCtrl.navigateForward(['/adminprofile']);
    this.pop.dismiss();
  }

  toInterruptions() {
    this.navCtrl.navigateForward(['/interruptions']);
    this.pop.dismiss();
  }

}
