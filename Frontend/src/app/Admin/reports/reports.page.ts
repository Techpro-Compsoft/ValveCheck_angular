import { Component, OnInit } from '@angular/core';
import { CompanyService } from 'src/app/core/Services/Company/company.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit {

  selectedDate: any;
  companyId: number;

  constructor(public companyService: CompanyService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.companyId = +this.activatedRoute.snapshot.paramMap.get('compId');
    console.log(this.companyId);
  }

  myChange(event) {
    this.selectedDate = event.target.value;
    this.selectedDate = this.selectedDate.substr(0, 10);
  }

  reportSubmit() {
    this.companyService.getReports({
      "company": this.companyId,
      "date": this.selectedDate
    }).subscribe(response => {
      if (response.status == "success") {
        console.log(response.data);
      }
      else if (response.status == "error") {
        alert(response.txt)
      }
    })
  }

}