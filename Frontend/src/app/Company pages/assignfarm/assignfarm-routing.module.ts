import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AssignfarmPage } from './assignfarm.page';

const routes: Routes = [
  {
    path: '',
    component: AssignfarmPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssignfarmPageRoutingModule {}
