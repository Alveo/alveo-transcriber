import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { NavComponent } from './nav.component';
import { AuthComponent } from './auth.component';
import { SelectorComponent } from './selector.component';
import { AnnotatorComponent } from './annotator.component';
import { BreadboardComponent } from './breadboard.component';
import { PlayerComponent } from './player.component';
import { AnnotationsComponent } from './annotations.component';

import { SessionService } from './session.service';
import { DataService } from './data.service';
import { MonitorService } from './monitor.service';
import { PlayerControlService } from './player-control.service';

import { AnnotationPipe } from './annotation.pipe';
import { DurationPipe } from './duration.pipe';

import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    BreadboardComponent,
    AuthComponent,
    AnnotatorComponent,
    SelectorComponent,
    PlayerComponent,
    AnnotationsComponent,
    AnnotationPipe,
    DurationPipe,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
  ],
  providers: [SessionService, DataService, MonitorService, PlayerControlService],
  bootstrap: [AppComponent]
})
export class AppModule { }
