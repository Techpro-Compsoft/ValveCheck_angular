import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SupervisorDashboardPage } from './supervisor-dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: SupervisorDashboardPage
  },

  {
    path: 'supervisor-block/:farmId',
    loadChildren: () => import('../supervisor-block/supervisor-block.module').then(m => m.SupervisorBlockPageModule)
  },
  {
    path: 'supervisor-report/:compId',
    loadChildren: () => import('../supervisor-report/supervisor-report.module').then(m => m.SupervisorReportPageModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SupervisorDashboardPageRoutingModule { }
