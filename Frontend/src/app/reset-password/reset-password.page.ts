import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { SupervisorService } from '../core/Services/Supervisor/supervisor.service';
import { BaseService } from '../core/Services/base.service';
import { MustMatch } from '../core/Helpers/mustMatch';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  resetPasswordForm: FormGroup;
  fullName: any;
  phone: any;
  userId: any;

  constructor(public formBuilder: FormBuilder,
    public modalCtrl: ModalController,
    public supervisorService: SupervisorService,
    public base: BaseService) { }

  ngOnInit() {
    this.getProfile();
    this.initResetPasswordForm();
  }

  getProfile() {
    try {
      this.base.getProfile().subscribe(response => {
        if (response.status == 'success') {
          this.fullName = response.data['fullname'];
          this.phone = response.data['phone'];
          this.userId = response.data['id'];
        }
        else if (response.status === "error") {
          alert(response.txt);
        }
      });
    } catch (error) {
      this.base.toastMessage('Something went wrong');
    }
  }

  initResetPasswordForm() {
    this.resetPasswordForm = this.formBuilder.group({
      password: [null, Validators.compose([Validators.required])],
      confirmPassword: [null, Validators.compose([Validators.required])],
    }, {
      validator: MustMatch('password', 'confirmPassword'),
    });
  }

  async resetPasswordSubmit() {
    try {
      this.base.resetPasswordCall({
        "id": this.userId,
        "fullname": this.fullName,
        "password": this.resetPasswordForm.value.password,
        "phone": this.phone
      }).subscribe(response => {
        if (response.status == "success") {
          this.base.toastMessage('Password reset successfully');
          this.modalCtrl.dismiss();
        }
      });
    }
    catch (error) {
      this.base.toastMessage('Something went wrong');
    }
  }

  dismissModal() {
    this.modalCtrl.dismiss();
  }



}
