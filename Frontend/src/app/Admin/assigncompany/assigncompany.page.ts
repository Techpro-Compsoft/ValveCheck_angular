import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CompanyService } from 'src/app/core/Services/Company/company.service';
import { SupervisorService } from 'src/app/core/Services/Supervisor/supervisor.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-assigncompany',
  templateUrl: './assigncompany.page.html',
  styleUrls: ['./assigncompany.page.scss'],
})
export class AssigncompanyPage implements OnInit {

  userId: number;
  companiesList: Array<object>;
  modeType: number;

  constructor(private activatedRoute: ActivatedRoute, private compService: CompanyService,
    private supService: SupervisorService, private nav: NavController) { }

  ngOnInit() {
    this.userId = +this.activatedRoute.snapshot.paramMap.get('id');
    this.modeType = +this.activatedRoute.snapshot.paramMap.get('mode');
    this.getAvailableCompanies();
  }

  getAvailableCompanies() {
    try {
      this.compService.fetchCompanies().subscribe(response => {
        if (response.status === "success") {
          this.companiesList = response.data;
        }
      });
    } catch (error) {
      alert('Something went wrong');
    }
  }

  assignCompany(val) {
    try {
      this.supService.assignOperator({
        "company": val,
        "user_id": [this.userId],
        "role": this.modeType === 1 ? 2 : 3
      }).subscribe(response => {
        if (response.status === "success") {
          alert('Assigned successfully');
          this.nav.pop();
        }
      })
    } catch (error) {
      alert('Something went wrong');
    }
  }

}