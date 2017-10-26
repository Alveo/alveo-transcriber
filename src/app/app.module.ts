import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AlveoModule } from './alveo/alveo.module';
import { GenericModule } from './generic/generic.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AlveoModule,
    GenericModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
