import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SupervisorService } from 'src/app/core/Services/Supervisor/supervisor.service';

@Component({
  selector: 'app-supervisor-block',
  templateUrl: './supervisor-block.page.html',
  styleUrls: ['./supervisor-block.page.scss'],
})
export class SupervisorBlockPage implements OnInit {
  farmId: number;
  role: any;
  blocksList: Array<object>;

  constructor(public activatedRoute: ActivatedRoute,
    public supervisorService: SupervisorService) { }

  ngOnInit() {
    this.farmId = +this.activatedRoute.snapshot.paramMap.get('farmId');
    let data = JSON.parse(localStorage.getItem('myUser'));
    this.role = data.role;
    this.getBlockDetails()
  }

  getBlockDetails() {
    this.supervisorService.getBlockDetailsCall({
      "farm": this.farmId,
      "role": this.role
    }).subscribe(response => {
      this.blocksList = response.data
    });
  }

}
