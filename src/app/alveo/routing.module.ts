import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthComponent } from './auth/auth.component';
import { DataSourceComponent } from './datasource/datasource.component';
import { OAuthCallbackComponent } from './auth/auth.component';
import { ListIndexComponent } from './listindex/listindex.component';
import { ListsComponent } from './lists/lists.component';
import { AnnotatorComponent } from '../annotator/annotator.component';

import { RequiresListGuard } from './shared/requires-list.guard';
import { RequiresListIndexGuard } from './shared/requires-list-index.guard';
import { RequiresAuthGuard } from './shared/requires-auth.guard';

const routes: Routes = [
      {
        path: '',
        component: DataSourceComponent,
      },
      {
        path: 'oauth/callback',
        component: OAuthCallbackComponent,
      },
      {
        path: 'lists/index',
        component: ListIndexComponent,
        canActivate: [RequiresListIndexGuard],
      },
      {
        path: 'lists/view',
        component: ListsComponent,
        canActivate: [RequiresListGuard],
      },
      {
        path: 'annotator',
        component: AnnotatorComponent,
        canActivate: [RequiresListGuard],
      },
      {
        path: '**',
        redirectTo: '',
        pathMatch: 'full',
      },
    ];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: false})],
  exports: [RouterModule],
  providers: [
    RequiresAuthGuard,
    RequiresListGuard,
    RequiresListIndexGuard
  ]
})

export class AlveoRoutingModule {}
