import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StickyModule } from 'ng2-sticky-kit';

import {
  MatButtonModule,
  MatDialogModule,
  MatIconModule,
  MatSelectModule,
  MatInputModule,
  MatCheckboxModule,
} from '@angular/material';

import { AnnotatorComponent } from './annotator.component';
import { PlayerComponent } from './player/player.component';
import { AnnotationViewComponent } from './annotation-view/annotation-view.component';
import { AnnotationListViewComponent } from './annotation-list-view/annotation-list-view.component';

import { DurationPipe } from './player/duration.pipe';
import { DurationShortPipe } from './player/duration.pipe';

import { AnnotatorService } from './shared/annotator.service';

import { Dialog } from './dialog/dialog.component';

@NgModule({
  declarations: [
    AnnotatorComponent,
    PlayerComponent,
    AnnotationViewComponent,
    AnnotationListViewComponent,
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
    MatSelectModule,
    MatInputModule,
    MatCheckboxModule,
    StickyModule
  ],
  exports: [
    AnnotatorComponent,
  ],
  providers: [
    AnnotatorService,
  ],
})
export class AnnotatorModule { }
