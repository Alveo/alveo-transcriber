import { CommonModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  MatButtonModule,
  MatDialogModule,
  MatIconModule,
  MatSelectModule,
  MatInputModule,
  MatCheckboxModule,
  MatProgressSpinnerModule
} from '@angular/material';

import { AnnotatorComponent } from './annotator.component';
import { PlayerComponent } from './player/player.component';
import { AnnotationViewComponent } from './annotation-view/annotation-view.component';
import { AnnotationListViewComponent } from './annotation-list-view/annotation-list-view.component';

import { DurationPipe, DurationShortPipe } from './player/duration.pipe';

import { DialogComponent } from './dialog/dialog.component';

import { Annotation } from './shared/annotation';

@NgModule({
  declarations: [
    AnnotatorComponent,
    PlayerComponent,
    AnnotationViewComponent,
    AnnotationListViewComponent,
    DurationPipe,
    DurationShortPipe,
    DialogComponent,
    Annotation
  ],
  entryComponents: [
    DialogComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatSelectModule,
    MatInputModule,
    MatCheckboxModule,
    MatProgressSpinnerModule
  ],
  exports: [
    AnnotatorComponent,
    Annotation
  ],
  providers: [],
})
export class AnnotatorModule { }
