import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AlveoUIModule } from './alveo-ui/alveo-ui.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AlveoUiModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
