import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OperatorBlockPageRoutingModule } from './operator-block-routing.module';

import { OperatorBlockPage } from './operator-block.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OperatorBlockPageRoutingModule
  ],
  declarations: [OperatorBlockPage]
})
export class OperatorBlockPageModule {}
