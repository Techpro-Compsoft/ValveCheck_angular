import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-supervisor-dashboard',
  templateUrl: './supervisor-dashboard.page.html',
  styleUrls: ['./supervisor-dashboard.page.scss'],
})
export class SupervisorDashboardPage implements OnInit {

  constructor(public navCtrl: NavController) { }

  ngOnInit() {
  }

  openProfilePage() {
    this.navCtrl.navigateForward(['/supervisor-profile'])
  }

}
