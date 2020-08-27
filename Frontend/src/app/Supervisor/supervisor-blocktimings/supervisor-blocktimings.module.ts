import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SupervisorBlocktimingsPageRoutingModule } from './supervisor-blocktimings-routing.module';

import { SupervisorBlocktimingsPage } from './supervisor-blocktimings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SupervisorBlocktimingsPageRoutingModule
  ],
  declarations: [SupervisorBlocktimingsPage]
})
export class SupervisorBlocktimingsPageModule {}
