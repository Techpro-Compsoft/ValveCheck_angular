import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CompanyService } from 'src/app/core/Services/Company/company.service';

@Component({
  selector: 'app-assigncompany',
  templateUrl: './assigncompany.page.html',
  styleUrls: ['./assigncompany.page.scss'],
})
export class AssigncompanyPage implements OnInit {

  supervisorId: number;
  companiesList: Array<object>;
  modeType: number;

  constructor(private activatedRoute: ActivatedRoute, private compService: CompanyService) { }

  ngOnInit() {
    this.supervisorId = +this.activatedRoute.snapshot.paramMap.get('id');
    this.modeType = +this.activatedRoute.snapshot.paramMap.get('mode');
    this.getAvailableCompanies();
  }

  getAvailableCompanies() {
    try {
      this.compService.getCompanies({ role: 2 }).subscribe(response => {
        if (response.status === "success") {
          this.companiesList = [];
          this.companiesList = response.data;
        }
      });
    } catch (error) {
      alert('Something went wrong');
    }
  }

}