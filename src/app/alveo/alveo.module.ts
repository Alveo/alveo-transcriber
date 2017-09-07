import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MdCoreModule, MdListModule, MdCardModule, MdButtonModule, MdCheckboxModule } from '@angular/material';

import { DevConsoleComponent } from './devconsole/devconsole.component';

import { NavComponent } from './nav/nav.component';
import { AuthComponent } from './auth/auth.component';

import { ItemListsComponent } from './itemlists/itemlists.component';
import { ItemsComponent } from './listview/items/items.component';
import { ListViewComponent } from './listview/listview.component';
import { DocsComponent } from './listview/docs/docs.component';

import { AlveoService } from './shared/alveo.service';
import { AuthService } from './shared/auth.service';
import { DBService } from './shared/db.service';

import 'hammerjs';

@NgModule({
  declarations: [
    DevConsoleComponent,
    NavComponent,
    AuthComponent,
    ItemListsComponent,
    ItemsComponent,
    ListViewComponent,
    DocsComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    MdButtonModule,
    MdCheckboxModule,
    MdCardModule,
    MdListModule,
    MdCoreModule,
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
