import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompaniesPage } from './companies.page';

const routes: Routes = [
  {
    path: '',
    component: CompaniesPage
  },
  {
    path: 'farms/:selectedId',
    loadChildren: () => import('../farms/farms.module').then(m => m.FarmsPageModule)
  },
  {
    path: 'supassign/:compId/:mode',
    loadChildren: () => import('../supervisorassignment/supervisorassignment.module').then(m => m.SupervisorassignmentPageModule)
  },
  {
    path: 'reports/:compId',
    loadChildren: () => import('../reports/reports.module').then(m => m.ReportsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompaniesPageRoutingModule { }
