import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OperatorProfilePageRoutingModule } from './operator-profile-routing.module';

import { OperatorProfilePage } from './operator-profile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    OperatorProfilePageRoutingModule
  ],
  declarations: [OperatorProfilePage]
})
export class OperatorProfilePageModule { }
