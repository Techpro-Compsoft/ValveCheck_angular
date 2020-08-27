import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SupervisorHomePage } from './supervisor-home.page';

const routes: Routes = [
  {
    path: '',
    component: SupervisorHomePage,
    children: [
      {
        path: 'supervisor-dashboard',
        loadChildren: () => import('../supervisor-dashboard/supervisor-dashboard.module').then(m => m.SupervisorDashboardPageModule)
      },
      {
        path: 'supervisor-instructions',
        loadChildren: () => import('../supervisor-instructions/supervisor-instructions.module').then(m => m.SupervisorInstructionsPageModule)
      },

      {
        path: '',
        redirectTo: '/supervisor-home/supervisor-instructions',
        pathMatch: 'full'
      }

    ]
  },
  {
    path: '',
    redirectTo: '/supervisor-home/supervisor-instructions',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SupervisorHomePageRoutingModule { }
