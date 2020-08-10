import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BaseService } from 'src/app/core/Services/base.service';

@Component({
  selector: 'app-adminprofile',
  templateUrl: './adminprofile.page.html',
  styleUrls: ['./adminprofile.page.scss'],
})
export class AdminprofilePage implements OnInit {

  profileForm: FormGroup;
  user: any;

  constructor(private nav: NavController, private fb: FormBuilder, private base: BaseService) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('myUser'));
    this.initForm(this.user);
  }

  initForm(data) {
    this.profileForm = this.fb.group({
      name: [data.fullname],
      email: [data.email],
      phone: [data.phone]
    });
  }

  logoutMe() {
    this.base.deletePlayerID(this.user.id).subscribe(response => {
      // alert("Deleted player ID : " + response);
      if (response) {
        localStorage.removeItem('myToken');
        localStorage.removeItem('myUser');
        this.nav.navigateRoot(['/login']);
      }
    });
  }

}