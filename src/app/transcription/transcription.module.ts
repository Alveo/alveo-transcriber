import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranscriptionService } from './transcription.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    TranscriptionService
  ],
  declarations: []
})
export class TranscriptionModule { }

export { TranscriptionService } from './transcription.service';
