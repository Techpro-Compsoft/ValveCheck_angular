import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SupervisorsPageRoutingModule } from './supervisors-routing.module';

import { SupervisorsPage } from './supervisors.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SupervisorsPageRoutingModule
  ],
  declarations: [SupervisorsPage]
})
export class SupervisorsPageModule {}
