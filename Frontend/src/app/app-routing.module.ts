import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('../app/Admin/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'supervisor-dashboard',
    loadChildren: () => import('./Supervisor/supervisor-dashboard/supervisor-dashboard.module').then(m => m.SupervisorDashboardPageModule)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./reset-password/reset-password.module').then(m => m.ResetPasswordPageModule)
  },
  {
    path: 'operator-dashboard',
    loadChildren: () => import('./Operator/operator-dashboard/operator-dashboard.module').then(m => m.OperatorDashboardPageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'adminprofile',
    loadChildren: () => import('./Admin/adminprofile/adminprofile.module').then(m => m.AdminprofilePageModule)
  }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
