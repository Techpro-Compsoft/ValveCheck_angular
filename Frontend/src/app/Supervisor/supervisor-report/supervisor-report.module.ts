import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SupervisorReportPageRoutingModule } from './supervisor-report-routing.module';

import { SupervisorReportPage } from './supervisor-report.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SupervisorReportPageRoutingModule
  ],
  declarations: [SupervisorReportPage]
})
export class SupervisorReportPageModule {}
