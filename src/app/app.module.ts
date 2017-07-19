import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { NavComponent } from './nav.component';
import { OAuth2Component } from './oauth2.component';
import { SelectorComponent } from './selector.component';
import { AnnotatorComponent } from './annotator.component';
import { BreadboardComponent } from './breadboard.component';
import { PlayerComponent } from './player.component';
import { ItemListsComponent } from './itemlists.component';
import { AnnotationsComponent } from './annotations.component';

import { OAuth2Service } from './oauth2.service';
import { DataService } from './data.service';
import { MonitorService } from './monitor.service';
import { PlayerControlService } from './player-control.service';
import { DBService } from './db.service';
import { AudioService } from './audio.service';

import { AuthInterface } from './auth.interface';

import { AnnotationPipe } from './annotation.pipe';
import { DurationPipe } from './duration.pipe';
import { DurationShortPipe } from './duration-short.pipe';

import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    BreadboardComponent,
    OAuth2Component,
    AnnotatorComponent,
    SelectorComponent,
    PlayerComponent,
    AnnotationsComponent,
    ItemListsComponent,
    AuthInterface,
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
    OAuth2Service, 
    DataService,
    MonitorService,
    PlayerControlService,
    AudioService,
    DBService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
