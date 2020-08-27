import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OperatorBlocktimingsPageRoutingModule } from './operator-blocktimings-routing.module';

import { OperatorBlocktimingsPage } from './operator-blocktimings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OperatorBlocktimingsPageRoutingModule
  ],
  declarations: [OperatorBlocktimingsPage]
})
export class OperatorBlocktimingsPageModule {}
