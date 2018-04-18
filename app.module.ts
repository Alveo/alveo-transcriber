import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AlveoTranscriberModule } from './transcriber/alveo-transcriber.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AlveoTranscriberModule,
  ],
  exports: [
    AlveoTranscriberModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
