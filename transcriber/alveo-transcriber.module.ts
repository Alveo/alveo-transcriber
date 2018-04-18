import { CommonModule } from '@angular/common';
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

import { AlveoTranscriber } from './alveo-transcriber/alveo-transcriber.component';
import { TranscriptionEditorComponent } from './transcription-editor/transcription-editor.component';
import { TranscriptionListEditorComponent } from './transcription-list-editor/transcription-list-editor.component';
import { PlayerComponent } from './player/player.component';

import { DurationPipe, DurationShortPipe } from './player/duration.pipe';

import { DialogComponent } from './dialog/dialog.component';

@NgModule({
  declarations: [
    AlveoTranscriber,
    TranscriptionEditorComponent,
    TranscriptionListEditorComponent,
    PlayerComponent,
    DurationPipe,
    DurationShortPipe,
    DialogComponent
  ],
  entryComponents: [
    DialogComponent
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
    AlveoTranscriber
  ],
  providers: [],
})
export class AlveoTranscriberModule { }
