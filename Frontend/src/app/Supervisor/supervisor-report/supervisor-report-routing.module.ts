import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SupervisorReportPage } from './supervisor-report.page';

const routes: Routes = [
  {
    path: '',
    component: SupervisorReportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SupervisorReportPageRoutingModule {}
