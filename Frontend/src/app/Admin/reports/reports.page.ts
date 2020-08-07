import { Component, OnInit } from '@angular/core';
import { CompanyService } from 'src/app/core/Services/Company/company.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit {

  companiesList: Array<object>;
  selectedDate: any;

  constructor(public companyService: CompanyService) { }

  ngOnInit() {
    this.getCompaniesList();
  }

  getCompaniesList() {
    try {
      this.companyService.fetchCompanies().subscribe(response => {
        console.log(response);
        if (response.status === "success") {
          this.companiesList = [];
          this.companiesList = response.data;
        }
      })
    } catch (error) {
      console.log(error);
    }
  }

  myChange(event) {
    this.selectedDate = event.target.value;
    this.selectedDate = this.selectedDate.substr(0, 10);

  }

  reportSubmit(val) {
    this.companyService.getReports({
      "company": val,
      "date": this.selectedDate
    }).subscribe(response => {
      if (response.status == "success") {

      }
      else if (response.status == "error") {
        alert(response.txt)
      }
    })
  }

}
