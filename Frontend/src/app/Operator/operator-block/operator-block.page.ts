import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OperatorService } from 'src/app/core/Services/Operator/operator.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AlertController, NavController } from '@ionic/angular';
import { BaseService } from 'src/app/core/Services/base.service';

@Component({
  selector: 'app-operator-block',
  templateUrl: './operator-block.page.html',
  styleUrls: ['./operator-block.page.scss'],
})
export class OperatorBlockPage implements OnInit {
  farmId: number;
  role: any;
  blocksList: Array<object>;
  blockLatitude: number;
  blockLongitude: number;

  constructor(public activatedRoute: ActivatedRoute,
    public operatorService: OperatorService,
    public alertCtrl: AlertController,
    private geolocation: Geolocation,
    public navCtrl: NavController,
    public base: BaseService) { }

  ngOnInit() {
    this.farmId = +this.activatedRoute.snapshot.paramMap.get('farmId');
    let data = JSON.parse(localStorage.getItem('myUser'));
    this.role = data.role;
    this.getBlockDetails();
  }

  getLocation(blockId) {
    this.geolocation.getCurrentPosition().then((resp) => {
      console.log(resp.coords.latitude)
      console.log(resp.coords.longitude)
      this.calculateDistance(resp.coords.latitude, resp.coords.longitude, blockId)
    }).catch((error) => {
      this.base.toastMessage('Error getting location');
    });
  }

  calculateDistance(lat1: number, long1: number, id) {
    let p = 0.017453292519943295;    // Math.PI / 180
    let c = Math.cos;
    let a = 0.5 - c((lat1 - this.blockLatitude) * p) / 2 + c(this.blockLatitude * p) * c((lat1) * p) * (1 - c(((long1 - this.blockLongitude) * p))) / 2;
    let dis = (12742 * Math.asin(Math.sqrt(a))); // 2 * R; R = 6371 km
    let distanceInMeters = dis * 1000; //distance in meters
    if (distanceInMeters <= 15) {
      this.navCtrl.navigateForward([`/operator-dashboard/operator-blocktimings/${id}`]);
    }
    else {
      this.base.toastMessage('You are not nearby to valve. Please go to exact location');
    }
  }

  getBlockDetails() {
    try {
      this.operatorService.getBlockDetailsCall({
        "farm": this.farmId,
        "role": this.role
      }).subscribe(response => {
        if (response.status === "success") {
          this.blocksList = response.data;
          this.blockLatitude = response.data[0]['latitude'];
          this.blockLongitude = response.data[0]['longitude'];
        }
        else if (response.status === "error") {
          alert(response.txt);
        }
      });
    } catch (error) {
      this.base.toastMessage('Something went wrong');
    }
  }

  viewValves(id) {
    this.getLocation(id);
  }

}
