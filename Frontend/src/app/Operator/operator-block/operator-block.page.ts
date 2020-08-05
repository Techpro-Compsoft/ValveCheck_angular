import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OperatorService } from 'src/app/core/Services/Operator/operator.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-operator-block',
  templateUrl: './operator-block.page.html',
  styleUrls: ['./operator-block.page.scss'],
})
export class OperatorBlockPage implements OnInit {
  farmId: number;
  role: any;
  blocksList: Array<object>;

  constructor(public activatedRoute: ActivatedRoute,
    public operatorService: OperatorService,
    public alertCtrl: AlertController,
    private geolocation: Geolocation,
    public navCtrl: NavController) { }

  ngOnInit() {
    this.farmId = +this.activatedRoute.snapshot.paramMap.get('farmId');
    let data = JSON.parse(localStorage.getItem('myUser'));
    this.role = data.role;
    this.getLocation();
    this.getBlockDetails();
  }

  getLocation() {
    this.geolocation.getCurrentPosition().then((resp) => {
      console.log(resp.coords.latitude)
      console.log(resp.coords.longitude)
      this.calculateDistance(resp.coords.latitude, resp.coords.longitude)
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  calculateDistance(lat1: number, long1: number) {
    let lat2 = 28.6509;
    let long2 = 77.1207;
    let p = 0.017453292519943295;    // Math.PI / 180
    let c = Math.cos;
    let a = 0.5 - c((lat1 - lat2) * p) / 2 + c(lat2 * p) * c((lat1) * p) * (1 - c(((long1 - long2) * p))) / 2;
    let dis = (12742 * Math.asin(Math.sqrt(a))); // 2 * R; R = 6371 km
    console.log(dis);
    return dis;
  }

  getBlockDetails() {
    try {
      this.operatorService.getBlockDetailsCall({
        "farm": this.farmId,
        "role": this.role
      }).subscribe(response => {
        console.log(response);
        this.blocksList = response.data;
      });
    } catch (error) {
      alert('something went wrong')
    }
  }


  viewValves(id) {
    this.navCtrl.navigateForward([`/operator-dashboard/operator-blocktimings/${id}`]);
  }

}
