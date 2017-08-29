import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { NavComponent } from './nav/nav.component';
import { AuthComponent } from './auth/auth.component';

import { ItemListsComponent } from './itemlists/itemlists.component';
import { ItemsComponent } from './dataview/items/items.component';
import { DataViewComponent } from './dataview/dataview.component';
import { DocsComponent } from './dataview/docs/docs.component';

import { AlveoService } from './shared/alveo.service';
import { AuthService } from './shared/auth.service';
import { DBService } from './shared/db.service';

@NgModule({
  declarations: [
    NavComponent,
    AuthComponent,
    ItemListsComponent,
    ItemsComponent,
    DataViewComponent,
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
    DataViewComponent,
  ],
  providers: [
    AuthService,
    AlveoService,
    DBService,
  ],
})
export class AlveoModule { }
