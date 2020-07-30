import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FarmsPageRoutingModule } from './farms-routing.module';

import { FarmsPage } from './farms.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FarmsPageRoutingModule
  ],
  declarations: [FarmsPage]
})
export class FarmsPageModule {}
