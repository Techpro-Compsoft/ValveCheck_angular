import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { SupervisorService } from 'src/app/core/Services/Supervisor/supervisor.service';
import { BaseService } from 'src/app/core/Services/base.service';

@Component({
  selector: 'app-supervisor-dashboard',
  templateUrl: './supervisor-dashboard.page.html',
  styleUrls: ['./supervisor-dashboard.page.scss'],
})
export class SupervisorDashboardPage implements OnInit {
  farmsList: Array<object>;
  companyId: any;

  constructor(public navCtrl: NavController,
    public supervisorService: SupervisorService,
    public base: BaseService) { }

  ngOnInit() {
    this.getDashboardDetails();
    this.getBlocks();
  }


  getBlocks() {
    this.supervisorService.getBlocksCall({ role: 2 }).subscribe(response => {
      console.log(response);
    })
  }

  getDashboardDetails() {
    try {
      let data = JSON.parse(localStorage.getItem('myUser'));
      this.supervisorService.getFarmDetailsCall({
        "user_id": data.id,
        "role": data.role
      }).subscribe(response => {
        console.log(response);
        if (response.status === 'success') {
          this.farmsList = response.data;
          this.companyId = response.data[0]['company'];
        }
        else if (response.status === "error") {
          alert(response.txt);
        }
      });
    } catch (error) {
      this.base.toastMessage('Something went wrong');
    }
  }

  viewBlocks(id) {
    this.navCtrl.navigateForward([`supervisor-home/supervisor-dashboard/supervisor-block/${id}`]);
  }

  openProfilePage() {
    this.navCtrl.navigateForward(['/supervisor-profile'])
  }

  getReport() {
    this.navCtrl.navigateForward([`supervisor-home/supervisor-dashboard/supervisor-report/${this.companyId}`]);
  }

}
