import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SupervisorDashboardPage } from './supervisor-dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: SupervisorDashboardPage
  },
  {
    path: 'supervisor-profile',
    loadChildren: () => import('../supervisor-profile/supervisor-profile.module').then(m => m.SupervisorProfilePageModule)
  },
  {
    path: 'supervisor-block/:farmId',
    loadChildren: () => import('../supervisor-block/supervisor-block.module').then(m => m.SupervisorBlockPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SupervisorDashboardPageRoutingModule { }
