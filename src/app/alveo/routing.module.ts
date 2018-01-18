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

import { Paths } from './shared/paths';

const routes: Routes = [
      {
        path: Paths.SelectDataSource,
        component: DataSourceComponent,
      },
      {
        path: Paths.OAuthCallback,
        component: OAuthCallbackComponent,
      },
      {
        path: Paths.ListIndex,
        component: ListIndexComponent,
        canActivate: [RequiresListIndexGuard],
      },
      {
        path: Paths.ListView,
        component: ListsComponent,
        canActivate: [RequiresListGuard],
      },
      {
        path: Paths.Annotator,
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
