import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: 'instructions',
        loadChildren: () => import('../../Admin/instructions/instructions.module').then(m => m.InstructionsPageModule)
      },
      {
        path: 'companies',
        loadChildren: () => import('../companies/companies.module').then(m => m.CompaniesPageModule)
      },
      {
        path: 'supervisors',
        loadChildren: () => import('../supervisors/supervisors.module').then(m => m.SupervisorsPageModule)
      },
      {
        path: 'operators',
        loadChildren: () => import('../operators/operators.module').then(m => m.OperatorsPageModule)
      },
      {
        path: '',
        redirectTo: '/home/instructions',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/home/instructions',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule { }
