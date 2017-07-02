import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NavComponent } from './nav.component';
import { AuthComponent } from './auth.component';
import { SessionComponent } from './session.component';

import { SessionService } from './session.service';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    SessionComponent,
    AuthComponent,
  ],
  imports: [
    BrowserModule
  ],
  providers: [SessionService],
  bootstrap: [AppComponent]
})
export class AppModule { }
