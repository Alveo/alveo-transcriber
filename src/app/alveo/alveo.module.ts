import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatDialogModule,
  MatExpansionModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatRippleModule,
  MatSelectModule,
  MatTableModule,
  MatSnackBarModule
} from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { AlveoTranscriberModule } from '@alveo-vl/angular-transcriber';

import { AlveoComponent } from './alveo.component';

import { DevConsoleComponent } from './devconsole/devconsole.component';
import { DataSourceComponent } from './datasource/datasource.component';

import { AlveoRoutingModule } from './routing.module';
import { NavComponent } from './nav/nav.component';
import { AuthComponent } from './auth/auth.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { OAuthCallbackComponent } from './oauth-callback/oauth-callback.component';

import { ListIndexComponent } from './listindex/listindex.component';
import { ListTableComponent } from './listindex/listtable/listtable.component';
import { TranscriberComponent } from './transcriber/transcriber.component';
import { ListsComponent } from './lists/lists.component';
import { ItemsComponent } from './lists/items/items.component';
import { SourceSelectComponent } from './lists/items/source-select/source-select.component';
import { ItemComponent } from './lists/items/item/item.component';
import { ItemLoaderComponent } from './lists/items/item-loader/item-loader.component';
import { ErrorNotifyComponent } from './error-notify/error-notify.component';

import { AuthService } from './shared/auth.service';
import { SegmentorService } from './shared/segmentor.service';
import { DBService } from './shared/db.service';
import { ApiService } from './shared/api.service';
import { SessionService } from './shared/session.service';
import { AnnotationService } from './shared/annotation.service';
import { MonitorService } from './shared/monitor.service';

@NgModule({
  declarations: [
    AlveoComponent,
    DevConsoleComponent,
    DataSourceComponent,
    NavComponent,
    AuthComponent,
    LoadingSpinnerComponent,
    OAuthCallbackComponent,
    ListIndexComponent,
    ListsComponent,
    ItemsComponent,
    SourceSelectComponent,
    ItemComponent,
    ItemLoaderComponent,
    ListTableComponent,
    TranscriberComponent,
    ErrorNotifyComponent
  ],
  entryComponents: [
    AuthComponent,
    ErrorNotifyComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,

    AlveoRoutingModule,
    AlveoTranscriberModule,

    CdkTableModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatExpansionModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatRippleModule,
    MatSelectModule,
    MatTableModule,
    MatSnackBarModule,
    FormsModule
  ],
  exports: [
    AlveoComponent,
  ],
  providers: [
    AuthService,
    DBService,
    SegmentorService,
    AnnotationService,
    ApiService,
    SessionService,
    MonitorService
  ],
})
export class AlveoModule { }
