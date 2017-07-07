import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthComponent } from './auth.component';
import { SelectorComponent } from './selector.component';
import { AnnotatorComponent } from './annotator.component';

import { RequiresAuthGuard } from './requires-auth.guard';

const routes: Routes = [
      {
        path: 'login',
        component: AuthComponent
      },
      {
        path: 'selector',
        component: SelectorComponent,
        canActivate: [RequiresAuthGuard],
        children: [
        ]
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
