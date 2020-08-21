import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SupervisorInstructionsPage } from './supervisor-instructions.page';

const routes: Routes = [
  {
    path: '',
    component: SupervisorInstructionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SupervisorInstructionsPageRoutingModule {}
