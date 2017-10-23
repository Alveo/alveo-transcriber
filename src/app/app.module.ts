import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AnnotatorModule } from './annotator/annotator.module';
import { AlveoModule } from './alveo/alveo.module';

import { AppComponent } from './app.component';

import { MonitorService } from './shared/monitor.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AnnotatorModule,
    AlveoModule,
  ],
  providers: [
    MonitorService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
