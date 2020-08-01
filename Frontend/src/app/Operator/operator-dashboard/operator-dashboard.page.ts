import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-operator-dashboard',
  templateUrl: './operator-dashboard.page.html',
  styleUrls: ['./operator-dashboard.page.scss'],
})
export class OperatorDashboardPage implements OnInit {

  constructor(public navCtrl: NavController) { }

  ngOnInit() {
  }

  openProfilePage() {
    this.navCtrl.navigateForward(['/operator-profile'])
  }

}
