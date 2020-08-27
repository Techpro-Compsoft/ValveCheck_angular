import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BlocktimingsPage } from './blocktimings.page';

const routes: Routes = [
  {
    path: '',
    component: BlocktimingsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BlocktimingsPageRoutingModule {}
