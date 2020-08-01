import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FarmService } from 'src/app/core/Services/Farm/farm.service';
import { NavController } from '@ionic/angular';

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
    private nav: NavController) { }

  ngOnInit() {
    this.blockId = +this.activatedRoute.snapshot.paramMap.get('blockId')
    this.farmId = +this.activatedRoute.snapshot.paramMap.get('farmId');
    this.getFarmDetails();
  }

  getFarmDetails() {
    try {
      this.farmService.farmDetails({ id: this.farmId }).subscribe(response => {
        if (response.status === "success") {
          this.availableUsers = [];
          this.availableUsers = response.data.operator;
        }
      });
    } catch (error) {
      alert('Something went wrong');
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
        })
      } catch (error) {
        alert('Something went wrong');
      }
    }
  }

}