import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminprofilePageRoutingModule } from './adminprofile-routing.module';

import { AdminprofilePage } from './adminprofile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AdminprofilePageRoutingModule
  ],
  declarations: [AdminprofilePage]
})
export class AdminprofilePageModule {}
