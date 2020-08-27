import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AssigncompanyPageRoutingModule } from './assigncompany-routing.module';

import { AssigncompanyPage } from './assigncompany.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AssigncompanyPageRoutingModule
  ],
  declarations: [AssigncompanyPage]
})
export class AssigncompanyPageModule {}
