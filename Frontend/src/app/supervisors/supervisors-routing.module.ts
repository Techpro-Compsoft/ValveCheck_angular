import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SupervisorsPage } from './supervisors.page';

const routes: Routes = [
  {
    path: '',
    component: SupervisorsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SupervisorsPageRoutingModule {}
