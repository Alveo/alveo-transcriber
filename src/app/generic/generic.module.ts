import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { GenericComponent } from './generic.component';
import { AnnotatorModule } from '../annotator/annotator.module';

@NgModule({
  declarations: [
    GenericComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,

    AnnotatorModule,
  ],
  exports: [
    GenericComponent,
  ],
  providers: [
  ],
})
export class GenericModule { }
