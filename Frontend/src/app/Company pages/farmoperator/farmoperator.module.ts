import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FarmoperatorPageRoutingModule } from './farmoperator-routing.module';

import { FarmoperatorPage } from './farmoperator.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FarmoperatorPageRoutingModule
  ],
  declarations: [FarmoperatorPage]
})
export class FarmoperatorPageModule {}
