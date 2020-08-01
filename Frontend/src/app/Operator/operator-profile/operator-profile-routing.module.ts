import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OperatorProfilePage } from './operator-profile.page';

const routes: Routes = [
  {
    path: '',
    component: OperatorProfilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OperatorProfilePageRoutingModule {}
