import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SupervisorBlockPage } from './supervisor-block.page';

const routes: Routes = [
  {
    path: '',
    component: SupervisorBlockPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SupervisorBlockPageRoutingModule {}
