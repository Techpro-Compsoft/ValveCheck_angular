import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BlocktimingsPageRoutingModule } from './blocktimings-routing.module';

import { BlocktimingsPage } from './blocktimings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BlocktimingsPageRoutingModule
  ],
  declarations: [BlocktimingsPage]
})
export class BlocktimingsPageModule {}
