import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SupervisorBlockPageRoutingModule } from './supervisor-block-routing.module';

import { SupervisorBlockPage } from './supervisor-block.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SupervisorBlockPageRoutingModule
  ],
  declarations: [SupervisorBlockPage]
})
export class SupervisorBlockPageModule {}
