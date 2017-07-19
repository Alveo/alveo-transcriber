import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { NavComponent } from './nav.component';
import { OAuth2Component } from './oauth2.component';
//import { MockAuthComponent } from './mock-auth.component';
import { SelectorComponent } from './selector.component';
import { AnnotatorComponent } from './annotator.component';
import { BreadboardComponent } from './breadboard.component';
import { PlayerComponent } from './player.component';
import { ItemListsComponent } from './itemlists.component';
import { AnnotationsComponent } from './annotations.component';

import { AppUtilService } from './app-util.service';

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
    //MockAuthComponent,
    AnnotatorComponent,
    SelectorComponent,
    PlayerComponent,
    AnnotationsComponent,
    ItemListsComponent,
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
  providers: [AppUtilService],
  bootstrap: [AppComponent]
})
export class AppModule { }
