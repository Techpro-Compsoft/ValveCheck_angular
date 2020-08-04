import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OperatorBlockPage } from './operator-block.page';

const routes: Routes = [
  {
    path: '',
    component: OperatorBlockPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OperatorBlockPageRoutingModule {}
