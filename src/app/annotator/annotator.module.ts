import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CsvService } from "angular2-json2csv";

import {
  MatButtonModule,
  MatDialogModule,
  MatIconModule,
} from '@angular/material';

import { AnnotatorComponent } from './annotator.component';
import { PlayerComponent } from './player/player.component';
import { AnnotationsComponent } from './annotations/annotations.component';

import { AnnotationPipe } from './annotations/annotation.pipe';
import { DurationPipe } from './player/duration.pipe';
import { DurationShortPipe } from './player/duration.pipe';

import { AnnotatorService } from './shared/annotator.service';
import { SegmentorService } from './shared/segmentor.service';

import { Dialog } from './dialog/dialog.component';

@NgModule({
  declarations: [
    AnnotatorComponent,
    PlayerComponent,
    AnnotationsComponent,
    AnnotationPipe,
    DurationPipe,
    DurationShortPipe,
    Dialog,
  ],
  entryComponents: [
    Dialog,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
  ],
  exports: [
    AnnotatorComponent,
  ],
  providers: [
    CsvService,
    AnnotatorService,
    SegmentorService,
  ],
})
export class AnnotatorModule { }
