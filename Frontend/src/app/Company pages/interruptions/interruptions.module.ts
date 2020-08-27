import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InterruptionsPageRoutingModule } from './interruptions-routing.module';

import { InterruptionsPage } from './interruptions.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InterruptionsPageRoutingModule
  ],
  declarations: [InterruptionsPage]
})
export class InterruptionsPageModule {}
