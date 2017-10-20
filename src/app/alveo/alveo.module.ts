import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
} from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';

import { DevConsoleComponent } from './devconsole/devconsole.component';

import { NavComponent } from './nav/nav.component';
import { AuthComponent } from './auth/auth.component';

import { ItemListsComponent } from './itemlists/itemlists.component';
import { ListTableComponent } from './itemlists/listtable/listtable.component';

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
    ListTableComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,

    CdkTableModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
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
