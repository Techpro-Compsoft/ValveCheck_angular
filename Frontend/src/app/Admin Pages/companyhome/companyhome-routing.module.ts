import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompanyhomePage } from './companyhome.page';

const routes: Routes = [
  {
    path: '',
    component: CompanyhomePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyhomePageRoutingModule {}
