import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InterruptionsPage } from './interruptions.page';

const routes: Routes = [
  {
    path: '',
    component: InterruptionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InterruptionsPageRoutingModule {}
