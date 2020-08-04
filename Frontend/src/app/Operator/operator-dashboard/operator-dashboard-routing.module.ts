import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OperatorDashboardPage } from './operator-dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: OperatorDashboardPage
  },
  {
    path: 'operator-profile',
    loadChildren: () => import('../operator-profile/operator-profile.module').then(m => m.OperatorProfilePageModule)
  },
  {
    path: 'operator-block/:farmId',
    loadChildren: () => import('../operator-block/operator-block.module').then(m => m.OperatorBlockPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OperatorDashboardPageRoutingModule { }
