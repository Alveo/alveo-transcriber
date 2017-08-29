import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AnnotatorComponent } from './annotator.component';
import { PlayerComponent } from './player/player.component';
import { AnnotationsComponent } from './annotations/annotations.component';

import { AnnotationPipe } from './annotations/annotation.pipe';
import { DurationPipe } from './player/duration.pipe';
import { DurationShortPipe } from './player/duration.pipe';

import { PlayerControlService } from './shared/player-control.service';

@NgModule({
  declarations: [
    AnnotatorComponent,
    PlayerComponent,
    AnnotationsComponent,
    AnnotationPipe,
    DurationPipe,
    DurationShortPipe,
  ],
  imports: [
    BrowserModule,
    FormsModule,
  ],
  exports: [
    AnnotatorComponent,
  ],
  providers: [
    PlayerControlService,
  ],
})
export class AnnotatorModule { }
