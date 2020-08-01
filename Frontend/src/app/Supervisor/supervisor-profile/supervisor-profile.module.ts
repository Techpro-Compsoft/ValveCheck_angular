import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SupervisorProfilePageRoutingModule } from './supervisor-profile-routing.module';

import { SupervisorProfilePage } from './supervisor-profile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SupervisorProfilePageRoutingModule
  ],
  declarations: [SupervisorProfilePage]
})
export class SupervisorProfilePageModule {}
