import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FarmService } from '../../core/Services/Farm/farm.service';
import { AlertController, NavController } from '@ionic/angular';
import { Location } from '@angular/common';

@Component({
  selector: 'app-blocks',
  templateUrl: './blocks.page.html',
  styleUrls: ['./blocks.page.scss'],
})
export class BlocksPage implements OnInit {

  farmID: number;
  companyId: number;
  blocksList: Array<object>;

  constructor(private activatedRoute: ActivatedRoute, private farmService: FarmService,
    private alertCtrl: AlertController, private nav: NavController) { }

  ngOnInit() {
    this.farmID = +this.activatedRoute.snapshot.paramMap.get('selectedId');
    this.companyId = +this.activatedRoute.snapshot.paramMap.get('compId');
  }

  ionViewWillEnter() {
    this.getBlocksForFarm();
  }

  getBlocksForFarm() {
    this.farmService.getBlocks({ id: this.farmID }).subscribe(response => {
      if (response.status === "success") {
        this.blocksList = [];
        this.blocksList = response.data;
      }
    });
  }

  async openBlockDialog(value?) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: value ? 'Edit Farm' : 'New Farm',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Block Name',
          value: value ? value.block_name : ''
        },
        {
          name: 'type',
          type: 'text',
          placeholder: 'Irrigation type',
          value: value ? value.irrigation : ''
        },
        {
          name: 'hectare',
          type: 'number',
          placeholder: 'Hectares',
          value: value ? value.hectares : ''
        },
        {
          name: 'latitude',
          type: 'number',
          placeholder: 'latitude',
          value: value ? value.latitude : ''
        },
        {
          name: 'longitude',
          type: 'number',
          placeholder: 'longitude',
          value: value ? value.longitude : ''
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: value ? 'EDIT' : 'ADD',
          handler: (data) => {
            value ? this.editBlock(data, value.id) : this.createBlock(data);
          }
        }
      ]
    });
    await alert.present();
  }

  createBlock(data) {
    try {
      this.farmService.createBlock({
        "farm": this.farmID,
        "block_name": data.name,
        "hectares": data.hectare,
        "latitude": data.latitude,
        "longitude": data.longitude,
        "irrigation": data.type
      }).subscribe(response => {
        if (response.status === "success") {
          alert('Block added');
          this.getBlocksForFarm();
        }
      });
    } catch (error) {
      alert('Something went wrong');
    }
  }

  editBlock(data, id) {
    try {
      this.farmService.updateBlock({
        "id": id,
        "farm": this.farmID,
        "block_name": data.name,
        "hectares": data.hectare,
        "latitude": data.latitude,
        "longitude": data.longitude,
        "irrigation": data.type
      }).subscribe(response => {
        if (response.status === "success") {
          alert('Block updated');
          this.getBlocksForFarm();
        }
      });
    } catch (error) {
      alert('Something went wrong');
    }
  }

  assignOperator(blockId) {
    this.nav.navigateForward([`/home/companies/farms/${this.farmID}/blocks/${blockId}/farmoperator/${blockId}/${this.farmID}`])
  }

  async presentAlertConfirm(blockId) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Confirm',
      message: 'Are you sure you want to remove this person',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            // console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Yes',
          handler: () => {
            // console.log('Confirm Okay');
            this.removeOperator(blockId)
          }
        }
      ]
    });
    await alert.present();
  }

  removeOperator(id) {
    try {
      this.farmService.removeOperator({
        "block": id
      }).subscribe(response => {
        if (response.status === "success") {
          alert('Operator removed');
          this.getBlocksForFarm();
        }
      })
    } catch (error) {
      alert('Something went wrong');
    }
  }

}