import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//import { MockAuthComponent } from './mock-auth.component';
import { OAuth2Component } from './oauth2.component';
import { SelectorComponent } from './selector.component';
import { AnnotatorComponent } from './annotator.component';
import { ItemListsComponent } from './itemlists.component';

import { RequiresAuthGuard } from './requires-auth.guard';

const routes: Routes = [
      {
        path: 'login',
        //component: MockAuthComponent
        component: OAuth2Component
      },
      {
        path: 'itemlists',
        component: ItemListsComponent
      },
  /*{
        path: 'itemlist',
        component: ItemListComponent
      },
   */
      {
        path: 'selector',
        component: SelectorComponent,
        canActivate: [RequiresAuthGuard],
      },
      {
        path: 'annotator',
        component: AnnotatorComponent,
        canActivate: [RequiresAuthGuard],
      },
      {
        path: '**',
        redirectTo: 'login',
        pathMatch: 'full',
      },
    ];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule],
  providers: [
    RequiresAuthGuard,
  ]
})

export class AppRoutingModule {}