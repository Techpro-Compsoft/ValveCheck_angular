import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SupervisorInstructionsPageRoutingModule } from './supervisor-instructions-routing.module';

import { SupervisorInstructionsPage } from './supervisor-instructions.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SupervisorInstructionsPageRoutingModule
  ],
  declarations: [SupervisorInstructionsPage]
})
export class SupervisorInstructionsPageModule {}
