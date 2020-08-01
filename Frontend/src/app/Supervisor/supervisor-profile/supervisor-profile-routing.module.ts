import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SupervisorProfilePage } from './supervisor-profile.page';

const routes: Routes = [
  {
    path: '',
    component: SupervisorProfilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SupervisorProfilePageRoutingModule {}
