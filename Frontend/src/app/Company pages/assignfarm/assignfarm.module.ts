import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AssignfarmPageRoutingModule } from './assignfarm-routing.module';

import { AssignfarmPage } from './assignfarm.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AssignfarmPageRoutingModule
  ],
  declarations: [AssignfarmPage]
})
export class AssignfarmPageModule {}
