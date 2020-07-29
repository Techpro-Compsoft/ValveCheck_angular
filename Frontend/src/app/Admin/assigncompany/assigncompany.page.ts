import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-assigncompany',
  templateUrl: './assigncompany.page.html',
  styleUrls: ['./assigncompany.page.scss'],
})
export class AssigncompanyPage implements OnInit {
  supervisorId: number;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.supervisorId = +this.activatedRoute.snapshot.paramMap.get('id');
    console.log(this.supervisorId);
    console.log(+this.activatedRoute.snapshot.paramMap.get('mode'));
  }

  getAvailableCompanies(){
    
  }

}