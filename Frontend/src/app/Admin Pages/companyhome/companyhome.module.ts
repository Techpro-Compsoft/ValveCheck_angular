import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompanyhomePageRoutingModule } from './companyhome-routing.module';

import { CompanyhomePage } from './companyhome.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CompanyhomePageRoutingModule
  ],
  declarations: [CompanyhomePage]
})
export class CompanyhomePageModule {}
