import { BrowserModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AnnotatorModule } from './transcriber/annotator.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AnnotatorModule,
  ],
  exports: [
    AnnotatorModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
