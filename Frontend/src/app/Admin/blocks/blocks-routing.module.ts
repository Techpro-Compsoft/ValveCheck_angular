import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BlocksPage } from './blocks.page';

const routes: Routes = [
  {
    path: '',
    component: BlocksPage
  },
  {
    path: 'farmoperator/:blockId/:farmId',
    loadChildren: () => import('../farmoperator/farmoperator.module').then(m=> m.FarmoperatorPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BlocksPageRoutingModule {}
