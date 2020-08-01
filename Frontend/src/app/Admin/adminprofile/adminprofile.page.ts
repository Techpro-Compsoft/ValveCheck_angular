import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-adminprofile',
  templateUrl: './adminprofile.page.html',
  styleUrls: ['./adminprofile.page.scss'],
})
export class AdminprofilePage implements OnInit {

  profileForm: FormGroup;

  constructor(private nav: NavController, private fb: FormBuilder) { }

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('myUser'));
    this.initForm(user);
  }

  initForm(data) {
    this.profileForm = this.fb.group({
      name: [data.fullname],
      email: [data.email],
      phone: [data.phone]
    });
  }

  logoutMe() {
    localStorage.removeItem('myToken');
    localStorage.removeItem('myUser');
    this.nav.navigateRoot(['/login']);
  }

}