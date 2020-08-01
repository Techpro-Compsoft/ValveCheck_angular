import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FarmsPage } from './farms.page';

const routes: Routes = [
  {
    path: '',
    component: FarmsPage
  },
  {
    path: 'blocks/:selectedId',
    loadChildren: () => import('../blocks/blocks.module').then(m => m.BlocksPageModule)
  },
  {
    path:'assigntofarm/:farmId/:mode/:compId',
    loadChildren: () => import('../assignfarm/assignfarm.module').then( m => m.AssignfarmPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FarmsPageRoutingModule {}
