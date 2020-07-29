import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CompanyService } from 'src/app/core/Services/Company/company.service';
import { SupervisorService } from 'src/app/core/Services/Supervisor/supervisor.service';

@Component({
  selector: 'app-supervisorassignment',
  templateUrl: './supervisorassignment.page.html',
  styleUrls: ['./supervisorassignment.page.scss'],
})
export class SupervisorassignmentPage implements OnInit {

  compId: any;
  companyDetails: any;
  supervisorsList: Array<object>;

  constructor(private activatedRoute: ActivatedRoute, private companyService: CompanyService,
    private supService: SupervisorService) { }

  ngOnInit() {
    this.compId = +this.activatedRoute.snapshot.paramMap.get('compId');
    this.getCompanyDetails();
    this.getSupervisors();
  }

  getCompanyDetails() {
    try {
      this.companyService.getFarmsForCompany({ id: this.compId }).subscribe(response => {
        if (response.status === "success") {
          this.companyDetails = response.data.company;
        }
      })
    } catch (error) {
      alert('Something went wrong');
    }
  }

  getSupervisors() {
    try {
      this.supService.getUsers({ role: 2 }).subscribe(response => {
        if (response.status === "success") {
          this.supervisorsList = response.data;
        }
      })
    } catch (error) {
      alert('Something went wrong');
    }
  }

  assignSupervisor(vl) {
    try {
      this.supService.assignOperator({
        "company": this.compId,
        "user_id": vl,
        "role": 2
      }).subscribe(response => {
        if (response.status === "success") {
          alert('Assigned successfully');
          this.getCompanyDetails();
        }
      })
    } catch (error) {
      alert('Something went wrong');
    }
  }
  //2 for supervisor

  changeSupervisor(val) {
    console.log(val);
  }

}