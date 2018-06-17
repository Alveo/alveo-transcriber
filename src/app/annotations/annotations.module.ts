import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnnotationsService } from './annotations.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    AnnotationsService
  ],
  declarations: []
})
export class AnnotationsModule { }

export { AnnotationsService } from './annotations.service';
