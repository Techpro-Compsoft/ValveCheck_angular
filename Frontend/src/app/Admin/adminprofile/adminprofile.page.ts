import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-adminprofile',
  templateUrl: './adminprofile.page.html',
  styleUrls: ['./adminprofile.page.scss'],
})
export class AdminprofilePage implements OnInit {

  constructor(private nav: NavController) { }

  ngOnInit() {
  }

  logoutMe() {
    localStorage.removeItem('myToken');
    localStorage.removeItem('myUser');
    this.nav.navigateRoot(['/login']);
  }

}