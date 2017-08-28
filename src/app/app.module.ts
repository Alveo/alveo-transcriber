import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { NavComponent } from './nav.component';
import { OAuth2Component } from './oauth2.component';
//import { MockAuthComponent } from './mock-auth.component';
import { AnnotatorComponent } from './annotator.component';
import { PlayerComponent } from './player.component';
import { ItemListsComponent } from './itemlists.component';
import { ItemsComponent } from './items.component';
import { AnnotationsComponent } from './annotations.component';
import { DataViewComponent } from './dataview.component';
import { DocsComponent } from './docs.component';

import { AuthService } from './auth.service';
import { AlveoService } from './alveo.service';
import { MonitorService } from './monitor.service';
import { PlayerControlService } from './player-control.service';
import { DBService } from './db.service';

import { AnnotationPipe } from './annotation.pipe';
import { DurationPipe } from './duration.pipe';
import { DurationShortPipe } from './duration.pipe';

import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    OAuth2Component,
    AnnotatorComponent,
    PlayerComponent,
    AnnotationsComponent,
    ItemListsComponent,
    ItemsComponent,
    DataViewComponent,
    DocsComponent,
    AnnotationPipe,
    DurationPipe,
    DurationShortPipe,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
  ],
  providers: [
    AuthService,
    AlveoService,
    DBService,
    MonitorService,
    PlayerControlService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
