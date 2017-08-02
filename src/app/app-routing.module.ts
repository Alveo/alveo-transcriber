import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//import { MockAuthComponent } from './mock-auth.component';
import { OAuth2Component } from './oauth2.component';
import { AnnotatorComponent } from './annotator.component';
import { ItemListsComponent } from './itemlists.component';
import { DataViewComponent } from './dataview.component';

import { RequiresAuthGuard } from './requires-auth.guard';

const routes: Routes = [
      {
        path: 'login',
        component: OAuth2Component
      },
      {
        path: 'oauth/callback',
        component: OAuth2Component
      },
      {
        path: 'itemlists',
        component: ItemListsComponent,
      },
      {
        path: 'dataview',
        component: DataViewComponent,
      },
      {
        path: 'annotator',
        component: AnnotatorComponent,
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
  ]
})

export class AppRoutingModule {}
