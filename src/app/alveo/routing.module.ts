import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthComponent } from './auth/auth.component';
import { OAuthCallbackComponent } from './auth/auth.component';
import { ListIndexComponent } from './listindex/listindex.component';
import { ListsComponent } from './lists/lists.component';
import { AnnotatorComponent } from '../annotator/annotator.component';

import { RequiresSelectionGuard } from './shared/requires-selection.guard';
import { RequiresAuthGuard } from './shared/requires-auth.guard';

const routes: Routes = [
      {
        path: 'oauth/callback',
        component: OAuthCallbackComponent,
      },
      {
        path: '',
        component: ListIndexComponent,
      },
      {
        path: 'lists/view',
        component: ListsComponent,
        canActivate: [RequiresSelectionGuard],
      },
      {
        path: 'annotator',
        component: AnnotatorComponent,
        canActivate: [RequiresSelectionGuard],
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
    RequiresSelectionGuard,
  ]
})

export class AlveoRoutingModule {}
