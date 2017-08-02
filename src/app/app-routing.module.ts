import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//import { MockAuthComponent } from './mock-auth.component';
import { OAuth2Component } from './oauth2.component';
import { AnnotatorComponent } from './annotator.component';
import { ItemListsComponent } from './itemlists.component';
import { DataViewComponent } from './dataview.component';

import { RequiresAuthGuard } from './requires-auth.guard';
import { RequiresSelectionGuard } from './requires-selection.guard';

const routes: Routes = [
      {
        path: 'oauth/callback',
        component: OAuth2Component,
      },
      {
        path: 'itemlists',
        component: ItemListsComponent,
      },
      {
        path: 'dataview',
        component: DataViewComponent,
        canActivate: [RequiresSelectionGuard],
      },
      {
        path: 'annotator',
        component: AnnotatorComponent,
        canActivate: [RequiresSelectionGuard],
      },
      {
        path: '**',
        redirectTo: 'itemlists',
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

export class AppRoutingModule {}
