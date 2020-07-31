import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('../app/Admin/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'supervisorassignment',
    loadChildren: () => import('./Admin/supervisorassignment/supervisorassignment.module').then( m => m.SupervisorassignmentPageModule)
  },
  {
    path: 'assigncompany',
    loadChildren: () => import('./Admin/assigncompany/assigncompany.module').then( m => m.AssigncompanyPageModule)
  },
  {
    path: 'assignfarm',
    loadChildren: () => import('./Admin/assignfarm/assignfarm.module').then( m => m.AssignfarmPageModule)
  },
  {
    path: 'farmoperator',
    loadChildren: () => import('./Admin/farmoperator/farmoperator.module').then( m => m.FarmoperatorPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
