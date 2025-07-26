import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterPageModule)
  },
 {
    path: 'dashboard',
    loadChildren: () =>
      import('./pages/dashboard-tabs/dashboard-tabs.module')
        .then(m => m.DashboardTabsPageModule),
  },
  {
    path: 'history',
    loadChildren: () => import('./pages/history/history.module').then(m => m.HistoryPageModule)
  },
  { path: 'admin', redirectTo: 'tabs/users', pathMatch: 'full' },
  {
    path: 'tabs',
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule)
  },

  { path: 'add-food', redirectTo: 'tabs/add-food', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
  {
    path: 'dashboard-tabs',
    loadChildren: () => import('./pages/dashboard-tabs/dashboard-tabs.module').then( m => m.DashboardTabsPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
