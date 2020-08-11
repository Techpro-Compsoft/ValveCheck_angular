import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FarmService } from 'src/app/core/Services/Farm/farm.service';
import { NavController } from '@ionic/angular';
import { BaseService } from 'src/app/core/Services/base.service';

@Component({
  selector: 'app-farmoperator',
  templateUrl: './farmoperator.page.html',
  styleUrls: ['./farmoperator.page.scss'],
})
export class FarmoperatorPage implements OnInit {

  farmId: number;
  blockId: number;
  availableUsers: Array<object>;

  constructor(private activatedRoute: ActivatedRoute, private farmService: FarmService,
    private nav: NavController, private base: BaseService) { }

  ngOnInit() {
    this.blockId = +this.activatedRoute.snapshot.paramMap.get('blockId')
    this.farmId = +this.activatedRoute.snapshot.paramMap.get('farmId');
    this.getFarmDetails();
  }

  getFarmDetails() {
    try {
      this.farmService.farmDetails({ id: this.farmId }).subscribe(response => {
        if (response.status === "success") {
          this.availableUsers = response.data.operator;
        }
        else if(response.status === "error"){
          alert(response.txt);
        }
      });
    } catch (error) {
      this.base.toastMessage('Something went wrong');
    }
  }

  assignOperator(val) {
    if (val.value) {
      try {
        this.farmService.assignblockOperator({
          "block": this.blockId,
          "user_id": val.value
        }).subscribe(response => {
          if (response.status === "success") {
            this.nav.pop();
          }
          else if(response.status === "error"){
            alert(response.txt);
          }
        });
      } catch (error) {
        this.base.toastMessage('Something went wrong');
      }
    }
  }

}