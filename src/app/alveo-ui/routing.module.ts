import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DataSourceComponent } from './datasource/datasource.component';
import { OAuthCallbackComponent } from './oauth-callback/oauth-callback.component';
import { ListIndexComponent } from './listindex/listindex.component';
import { ListsComponent } from './lists/lists.component';
import { TranscriberComponent } from './transcriber/transcriber.component';

import { Paths } from './shared/paths';

/* These are the routes we utilize across the AlveoUI module.
 * You can add, remove and modify routes by editing `./shared/paths.ts`.
 *
 * The advantage of having them in an enum is for change centralisation.
 */
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
      },
      {
        path: Paths.ListView + ':id',
        component: ListsComponent,
      },
      {
        path: Paths.Transcriber + ':list_id/:collection_id/:item_id/:doc_id',
        component: TranscriberComponent
      },
      {
        path: '**',
        redirectTo: Paths.Index,
        pathMatch: 'full',
      },
    ];

/* This module just works with the Angular Router module and provides the above
 * routes to it. Functionally it does not extend or modify the Angular Router.
 */
@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: false})],
  exports: [RouterModule],
  providers: []
})

export class AlveoRoutingModule {}
