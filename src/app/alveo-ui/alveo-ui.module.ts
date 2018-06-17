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
} from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';

import { AlveoTranscriberModule } from 'alveo-transcriber';

import { AlveoRoutingModule } from './routing.module';

import { AlveoUIComponent } from './alveo-ui.component';
import { AuthComponent } from './auth/auth.component';
import { DataSourceComponent } from './datasource/datasource.component';
import { DevConsoleComponent } from './devconsole/devconsole.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { ListIndexComponent } from './listindex/listindex.component';
import { ListsComponent } from './lists/lists.component';
import { ListTableComponent } from './listindex/listtable/listtable.component';
import { NavComponent } from './nav/nav.component';
import { OAuthCallbackComponent } from './oauth-callback/oauth-callback.component';
import { ItemComponent } from './lists/items/item/item.component';
import { ItemLoaderComponent } from './lists/items/item-loader/item-loader.component';
import { ItemsComponent } from './lists/items/items.component';
import { SourceSelectComponent } from './lists/items/source-select/source-select.component';
import { TranscriberComponent } from './transcriber/transcriber.component';

import { AuthService } from './shared/auth.service';

import { AlveoClientModule } from '../alveo-client/alveo-client.module';
import { AlveoTransServClientModule } from '../alveo-transserv-client/alveo-transserv-client.module';
import { AnnotationsModule } from '../annotations/annotations.module';
import { BrowserCacheModule } from '../browser-cache/browser-cache.module';
import { OnlineStatusModule } from '../online-status/online-status.module';
import { SessionModule } from '../session/session.module';

import { environment } from '../../environments/environment';

@NgModule({
  declarations: [
    AlveoUIComponent,
    AuthComponent,
    DataSourceComponent,
    DevConsoleComponent,
    ItemComponent,
    ItemLoaderComponent,
    ItemsComponent,
    LoadingSpinnerComponent,
    ListIndexComponent,
    ListsComponent,
    ListTableComponent,
    NavComponent,
    OAuthCallbackComponent,
    SourceSelectComponent,
    TranscriberComponent,
  ],
  entryComponents: [
    AuthComponent
  ],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    CdkTableModule,
    FormsModule,
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

    AlveoClientModule,
    AlveoRoutingModule,
    AlveoTranscriberModule,
    AlveoTransServClientModule,
    AnnotationsModule,
    BrowserCacheModule,
    OnlineStatusModule,
    SessionModule
  ],
  exports: [
    AlveoUIComponent,
  ],
  providers: [
    AuthService
  ],
})
export class AlveoUIModule { }
