import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AssigncompanyPage } from './assigncompany.page';

const routes: Routes = [
  {
    path: '',
    component: AssigncompanyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssigncompanyPageRoutingModule {}
