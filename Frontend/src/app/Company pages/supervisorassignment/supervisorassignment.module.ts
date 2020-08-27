import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SupervisorassignmentPageRoutingModule } from './supervisorassignment-routing.module';

import { SupervisorassignmentPage } from './supervisorassignment.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SupervisorassignmentPageRoutingModule
  ],
  declarations: [SupervisorassignmentPage]
})
export class SupervisorassignmentPageModule {}
