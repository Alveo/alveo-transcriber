import { TestBed, async } from '@angular/core/testing';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { NavComponent } from './nav.component';
import { AuthComponent } from './auth.component';
import { SelectorComponent } from './selector.component';
import { AnnotatorComponent } from './annotator.component';
import { SessionComponent } from './session.component';
import { PlayerComponent } from './player.component';

import { SessionService } from './session.service';
import { DataService } from './data.service';
import { MonitorService } from './monitor.service';

import { AppRoutingModule } from './app-routing.module';

import { DurationPipe } from './duration.pipe';

import { APP_BASE_HREF } from '@angular/common';

describe('AuthComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        NavComponent,
        SessionComponent,
        AuthComponent,
        AnnotatorComponent,
        SelectorComponent,
        PlayerComponent,
        DurationPipe,
      ],
      imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        AppRoutingModule
      ],
      providers: [SessionService, DataService, MonitorService,
      {provide: APP_BASE_HREF, useValue: '/'}],
    }).compileComponents();
  }));

  it('should show welcome text when logged out by default', async(() => {
    //component.sessionService.logIn();
    // querySelector('#thing').outerHTML
    const fixture = TestBed.createComponent(AuthComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('#welcome-text').textContent).toContain('Welcome');
  }));
});
