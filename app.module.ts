import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AnnotatorModule } from './transcriber/annotator.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CommonModule,
    AnnotatorModule,
  ],
  exports: [
    CommonModule,
    AnnotatorModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
