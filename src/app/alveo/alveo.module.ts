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

import { AlveoComponent } from './alveo.component';

import { AlveoRoutingModule } from './routing.module';
import { NavComponent } from './nav/nav.component';
import { AuthComponent } from './auth/auth.component';
import { OAuthCallbackComponent } from './auth/auth.component';

import { ItemListsComponent } from './itemlists/itemlists.component';
import { ListTableComponent } from './itemlists/listtable/listtable.component';

import { ListViewComponent } from './listview/listview.component';
import { DocsComponent } from './listview/docs/docs.component';

import { AlveoService } from './shared/alveo.service';
import { AuthService } from './shared/auth.service';
import { DBService } from './shared/db.service';
import { AnnotatorModule } from '../annotator/annotator.module';

import 'hammerjs';

@NgModule({
  declarations: [
    AlveoComponent,
    DevConsoleComponent,
    NavComponent,
    AuthComponent,
    OAuthCallbackComponent,
    ItemListsComponent,
    ListViewComponent,
    DocsComponent,
    ListTableComponent,
  ],
  entryComponents: [
    AuthComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,

    AlveoRoutingModule,
    AnnotatorModule,

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
    AlveoComponent,
  ],
  providers: [
    AuthService,
    AlveoService,
    DBService,
  ],
})
export class AlveoModule { }
