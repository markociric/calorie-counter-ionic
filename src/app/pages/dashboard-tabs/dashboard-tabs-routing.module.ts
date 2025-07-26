import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardTabsPage } from './dashboard-tabs.page';

const routes: Routes = [
   {
    path: '',
    component: DashboardTabsPage,
    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardTabsPageRoutingModule {}
