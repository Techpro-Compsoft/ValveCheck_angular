import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('../app/Company Pages/home/home.module').then(m => m.HomePageModule)
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
    loadChildren: () => import('./Admin Pages/adminprofile/adminprofile.module').then(m => m.AdminprofilePageModule)
  },
  {
    path: 'supervisor-report',
    loadChildren: () => import('./Supervisor/supervisor-report/supervisor-report.module').then(m => m.SupervisorReportPageModule)
  },
  {
    path: 'interruptions',
    loadChildren: () => import('./Company Pages/interruptions/interruptions.module').then(m => m.InterruptionsPageModule)
  },
  {
    path: 'instructions',
    loadChildren: () => import('./Company Pages/instructions/instructions.module').then(m => m.InstructionsPageModule)
  },
  {
    path: 'supervisor-profile',
    loadChildren: () => import('./Supervisor/supervisor-profile/supervisor-profile.module').then(m => m.SupervisorProfilePageModule)
  },
  {
    path: 'supervisor-home',
    loadChildren: () => import('./Supervisor/supervisor-home/supervisor-home.module').then(m => m.SupervisorHomePageModule)
  },
  {
    path: 'supervisor-blocktimings/:blockId',
    loadChildren: () => import('./Supervisor/supervisor-blocktimings/supervisor-blocktimings.module').then(m => m.SupervisorBlocktimingsPageModule)
  },
  {
    path: 'admin-home',
    loadChildren: () => import('./Admin Pages/companies/companies.module').then(m => m.CompaniesPageModule)
  },
  {
    path: 'reports',
    loadChildren: () => import('./Company pages/reports/reports.module').then(m => m.ReportsPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
