import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InstructionsPage } from './instructions.page';

const routes: Routes = [
  {
    path: '',
    component: InstructionsPage
  },
  {
    path: 'blocktimings/:id',
    loadChildren: () => import('../blocktimings/blocktimings.module').then(m => m.BlocktimingsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InstructionsPageRoutingModule {}
