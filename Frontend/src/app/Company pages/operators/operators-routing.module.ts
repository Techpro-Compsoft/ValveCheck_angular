import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OperatorsPage } from './operators.page';

const routes: Routes = [
  {
    path: '',
    component: OperatorsPage
  },
  {
    path: 'assigncompany/:id/:mode',
    loadChildren:() => import('../assigncompany/assigncompany.module').then(m => m.AssigncompanyPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OperatorsPageRoutingModule {}
