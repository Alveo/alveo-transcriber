import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthComponent } from './auth/auth.component';
import { ItemListsComponent } from './itemlists/itemlists.component';
import { ListViewComponent } from './listview/listview.component';
import { AnnotatorComponent } from '../annotator/annotator.component';

import { RequiresSelectionGuard } from './shared/requires-selection.guard';
import { RequiresAuthGuard } from './shared/requires-auth.guard';

const routes: Routes = [
      {
        path: 'oauth/callback',
        component: AuthComponent,
      },
      {
        path: '',
        component: ItemListsComponent,
      },
      {
        path: 'listview',
        component: ListViewComponent,
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
