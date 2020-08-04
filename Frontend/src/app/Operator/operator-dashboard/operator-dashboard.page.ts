import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { OperatorService } from 'src/app/core/Services/Operator/operator.service';

@Component({
  selector: 'app-operator-dashboard',
  templateUrl: './operator-dashboard.page.html',
  styleUrls: ['./operator-dashboard.page.scss'],
})
export class OperatorDashboardPage implements OnInit {
  farmsList: Array<object>;

  constructor(public navCtrl: NavController,
    public operatorService: OperatorService) { }

  ngOnInit() {
    this.getDashboardDetails();
  }

  getDashboardDetails() {
    let data = JSON.parse(localStorage.getItem('myUser'));
    this.operatorService.getFarmDetailsCall({
      "user_id": data.id,
      "role": data.role
    }).subscribe(response => {
      console.log(response);
      this.farmsList = response.data
    });
  }

  viewBlocks(id) {
    this.navCtrl.navigateForward([`/operator-dashboard/operator-block/${id}`]);
  }


  openProfilePage() {
    this.navCtrl.navigateForward(['/operator-dashboard/operator-profile'])
  }

}
