import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OperatorBlocktimingsPage } from './operator-blocktimings.page';

const routes: Routes = [
  {
    path: '',
    component: OperatorBlocktimingsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OperatorBlocktimingsPageRoutingModule {}
