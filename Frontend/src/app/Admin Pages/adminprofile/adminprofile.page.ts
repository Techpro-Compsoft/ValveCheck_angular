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
  isReadOnly: boolean = true;

  constructor(private nav: NavController, private fb: FormBuilder, private base: BaseService) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.user = JSON.parse(localStorage.getItem('myUser'));
    this.profileForm = this.fb.group({
      name: [ this.user.fullname],
      email: [ this.user.email],
      phone: [parseInt( this.user.phone)],
      id: [ this.user.id]
    });
  }

  toggleRead() {
    this.isReadOnly = !this.isReadOnly;
  }
  
  updateProfile() {
    if (this.profileForm.controls.name.value.length === 0 || this.profileForm.controls.name.value.length > 50) {
      alert('Name length should be between 1-50');
    } else if (this.profileForm.controls.phone.value.toString().length <= 7 || this.profileForm.controls.phone.value.toString().length > 12) {
      alert('Phone number length should be between 8-12');
    }
    else {
      try {
        this.base.editOperatorProfileCall({
          "id": this.profileForm.controls.id.value,
          "fullname": this.profileForm.controls.name.value,
          "phone": this.profileForm.controls.phone.value
        }).subscribe(response => {
          if (response.status === 'success') {
            this.getProfile();
            this.toggleRead();
            this.base.toastMessage('Profile updated successfully');
          }
          else if (response.status === "error") {
            alert(response.txt);
          }
        });
      } catch (error) {
        this.base.toastMessage('Something went wrong');
      }
    }
  }

  getProfile() {
    try {
      this.base.getProfile().subscribe(response => {
        if (response.status == 'success') {
          localStorage.setItem('myUser', JSON.stringify(response.data));
          this.initForm();
        }
        else if (response.status === "error") {
          alert(response.txt);
        }
      });
    } catch (error) {
      this.base.toastMessage('Something went wrong');
    }
  }

}