import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SupervisorHomePageRoutingModule } from './supervisor-home-routing.module';

import { SupervisorHomePage } from './supervisor-home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SupervisorHomePageRoutingModule
  ],
  declarations: [SupervisorHomePage]
})
export class SupervisorHomePageModule {}
