import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { 
  HttpClientModule,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
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

import { ListIndexComponent } from './listindex/listindex.component';
import { ListTableComponent } from './listindex/listtable/listtable.component';

import { ListsComponent } from './lists/lists.component';
import { ItemsComponent } from './lists/items/items.component';
import { DocsComponent } from './lists/items/docs/docs.component';

import { AlveoService } from './shared/alveo.service';
import { AuthService } from './shared/auth.service';
import { DBService } from './shared/db.service';
import { ApiService } from './shared/api.service';
import { SessionService } from './shared/session.service';
import { AnnotatorModule } from '../annotator/annotator.module';

import { ApiInterceptor } from './shared/api.interceptor';

import 'hammerjs';

@NgModule({
  declarations: [
    AlveoComponent,
    DevConsoleComponent,
    NavComponent,
    AuthComponent,
    OAuthCallbackComponent,
    ListIndexComponent,
    ListsComponent,
    ItemsComponent,
    DocsComponent,
    ListTableComponent,
  ],
  entryComponents: [
    AuthComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,

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
    ApiService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true
    },
    SessionService,
  ],
})
export class AlveoModule { }
