// src/app/pages/tabs/tabs-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'admin',
        loadChildren: () =>
          import('../admin/admin.module').then(m => m.AdminPageModule)
      },
      {
        path: 'add-food',
        loadChildren: () =>
          import('../add-food/add-food.module').then(m => m.AddFoodPageModule)
      },
      {
        path: '',
        redirectTo: 'admin',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
