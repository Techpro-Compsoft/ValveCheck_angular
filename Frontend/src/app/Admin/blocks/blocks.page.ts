import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FarmService } from '../../core/Services/Farm/farm.service';
import { AlertController, NavController } from '@ionic/angular';
import { Location } from '@angular/common';
import { BaseService } from 'src/app/core/Services/base.service';

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
    private alertCtrl: AlertController, private nav: NavController,
    private base: BaseService) { }

  ngOnInit() {
    this.farmID = +this.activatedRoute.snapshot.paramMap.get('selectedId');
    this.companyId = +this.activatedRoute.snapshot.paramMap.get('compId');
  }

  ionViewWillEnter() {
    this.getBlocksForFarm();
  }

  getBlocksForFarm() {
    try {
      this.farmService.getBlocks({ id: this.farmID }).subscribe(response => {
        if (response.status === "success") {
          this.blocksList = response.data;
        }
        else if (response.status === "error") {
          alert(response.txt);
        }
      });
    } catch (error) {
      this.base.toastMessage('Something went wrong');
    }
  }

  async openBlockDialog(value?) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: value ? 'Update Block' : 'New Block',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Block Name *',
          value: value ? value.block_name : ''
        },
        {
          name: 'type',
          type: 'text',
          placeholder: 'Irrigation type *',
          value: value ? value.irrigation : ''
        },
        {
          name: 'hectare',
          type: 'number',
          placeholder: 'Hectares *',
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
        },
        {
          name: 'lthr',
          type: 'number',
          placeholder: 'Lt/hr *',
          value: value ? value.ltr_hr : ''
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            // console.log('Confirm Cancel');
          }
        }, {
          text: value ? 'UPDATE' : 'ADD',
          handler: (data) => {
            value ? this.editBlock(data, value.id) : this.createBlock(data);
          }
        }
      ]
    });
    await alert.present();
  }

  checkValidation(name: string, hect: string, irr: string, ltr: string): boolean {
    if (name.trim().length === 0) {
      return false
    }
    else if (hect.length === 0) {
      return false;
    }
    else if (irr.length === 0) {
      return false;
    }
    else if (ltr.length === 0) {
      return false;
    }
    else {
      return true;
    }
  }

  createBlock(data) {
    if (this.checkValidation(data.name, data.hectare, data.type, data.lthr)) {
      if (data.name.trim().length > 50) {
        this.base.toastMessage('Block name should be between 1-50 characters');
      }
      else if (data.type.trim().length > 20) {
        this.base.toastMessage('Irrigation type should be between 1-20 characters');
      }
      else {
        try {
          this.farmService.createBlock({
            "farm": this.farmID,
            "block_name": data.name,
            "hectares": data.hectare,
            "latitude": data.latitude,
            "longitude": data.longitude,
            "irrigation": data.type,
            "ltr_hr": parseFloat(data.lthr).toFixed(1)
          }).subscribe(response => {
            if (response.status === "success") {
              this.base.toastMessage('Block created');
              this.getBlocksForFarm();
            }
            else if (response.status === "error") {
              alert(response.txt);
            }
          });
        } catch (error) {
          this.base.toastMessage('Something went wrong');
        }
      }
    }
    else {
      this.base.toastMessage('Please enter required details');
    }

  }

  editBlock(data, id) {
    if (this.checkValidation(data.name, data.hectare, data.type, data.lthr)) {
      if (data.name.trim().length > 50) {
        this.base.toastMessage('Block name should be between 1-50 characters');
      }
      else if (data.type.trim().length > 20) {
        this.base.toastMessage('Irrigation type should be between 1-20 characters');
      }
      else {
        try {
          this.farmService.updateBlock({
            "id": id,
            "farm": this.farmID,
            "block_name": data.name,
            "hectares": data.hectare,
            "latitude": data.latitude,
            "longitude": data.longitude,
            "irrigation": data.type,
            "ltr_hr": parseFloat(data.lthr).toFixed(1)
          }).subscribe(response => {
            if (response.status === "success") {
              this.base.toastMessage('Block updated');
              this.getBlocksForFarm();
            }
            else if (response.status === "error") {
              alert(response.txt);
            }
          });
        } catch (error) {
          this.base.toastMessage('Something went wrong');
        }
      }
    }
    else {
      this.base.toastMessage('Please enter required details');
    }
  }

  assignOperator(blockId) {
    this.nav.navigateForward([`/home/companies/farms/${this.farmID}/blocks/${blockId}/farmoperator/${blockId}/${this.farmID}`]);
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
          this.base.toastMessage('Operator removed');
          this.getBlocksForFarm();
        }
        else if (response.status === "error") {
          alert(response.txt);
        }
      });
    } catch (error) {
      this.base.toastMessage('Something went wrong');
    }
  }

  blockTimings(id, operatorId) {
    if (operatorId) {
      this.nav.navigateForward([`/home/companies/farms/${this.farmID}/blocks/${id}/blocktimings/${id}/${operatorId}`]);
    }
    else {
      this.base.toastMessage('Please assign an operator to proceed further');
    }
  }

}