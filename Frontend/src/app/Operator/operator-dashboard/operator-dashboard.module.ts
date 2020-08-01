import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OperatorDashboardPageRoutingModule } from './operator-dashboard-routing.module';

import { OperatorDashboardPage } from './operator-dashboard.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OperatorDashboardPageRoutingModule
  ],
  declarations: [OperatorDashboardPage]
})
export class OperatorDashboardPageModule {}
