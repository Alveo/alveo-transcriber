import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { NavComponent } from './nav/nav.component';
import { AuthComponent } from './auth/auth.component';

import { ItemListsComponent } from './itemlists/itemlists.component';
import { ItemsComponent } from './listview/items/items.component';
import { ListViewComponent } from './listview/listview.component';
import { DocsComponent } from './listview/docs/docs.component';

import { AlveoService } from './shared/alveo.service';
import { AuthService } from './shared/auth.service';
import { DBService } from './shared/db.service';

@NgModule({
  declarations: [
    NavComponent,
    AuthComponent,
    ItemListsComponent,
    ItemsComponent,
    ListViewComponent,
    DocsComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
  ],
  exports: [
    NavComponent,
    AuthComponent,
    ItemListsComponent,
    ListViewComponent,
  ],
  providers: [
    AuthService,
    AlveoService,
    DBService,
  ],
})
export class AlveoModule { }
