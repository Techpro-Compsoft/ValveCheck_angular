import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { SupervisorService } from 'src/app/core/Services/Supervisor/supervisor.service';

@Component({
  selector: 'app-supervisor-dashboard',
  templateUrl: './supervisor-dashboard.page.html',
  styleUrls: ['./supervisor-dashboard.page.scss'],
})
export class SupervisorDashboardPage implements OnInit {
  farmsList: Array<object>;

  constructor(public navCtrl: NavController,
    public supervisorService: SupervisorService) { }

  ngOnInit() {
    this.getDashboardDetails();
  }

  getDashboardDetails() {
    try {
      let data = JSON.parse(localStorage.getItem('myUser'));
      this.supervisorService.getFarmDetailsCall({
        "user_id": data.id,
        "role": data.role
      }).subscribe(response => {
        console.log(response);
        this.farmsList = response.data
      });
    } catch (error) {
      alert('something went wrong');
    }
  }

  viewBlocks(id) {
    this.navCtrl.navigateForward([`/supervisor-dashboard/supervisor-block/${id}`]);
  }

  openProfilePage() {
    this.navCtrl.navigateForward(['/supervisor-dashboard/supervisor-profile'])
  }

}
