import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SupervisorBlocktimingsPage } from './supervisor-blocktimings.page';

const routes: Routes = [
  {
    path: '',
    component: SupervisorBlocktimingsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SupervisorBlocktimingsPageRoutingModule {}
