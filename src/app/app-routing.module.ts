import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//import { AlveoModule } from './alveo/alveo.module';
//import { AnnotatorModule } from './annotator/annotator.module';

// Should be a better way to import these
import { AuthComponent } from './alveo/auth/auth.component';
import { ItemListsComponent } from './alveo/itemlists/itemlists.component';
import { ListViewComponent } from './alveo/listview/listview.component';
import { AnnotatorComponent } from './annotator/annotator.component';

import { RequiresSelectionGuard } from './alveo/shared/requires-selection.guard';
import { RequiresAuthGuard } from './alveo/shared/requires-auth.guard';

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

export class AppRoutingModule {}
