import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SupervisorsPage } from './supervisors.page';

const routes: Routes = [
  {
    path: '',
    component: SupervisorsPage
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
export class SupervisorsPageRoutingModule {}
