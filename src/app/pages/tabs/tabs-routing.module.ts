import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'users',
        loadChildren: () =>
          import('../admin/admin.module').then((m) => m.AdminPageModule),
      },
      {
        path: 'add-food',
        loadChildren: () =>
          import('../add-food/add-food.module').then((m) => m.AddFoodPageModule),
      },
      {
        path: '',
        redirectTo: 'users',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
