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

import { SessionService } from './session.service';
import { DataService } from './data.service';
import { MonitorService } from './monitor.service';

import { DurationPipe } from './duration.pipe';


describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        NavComponent,
        SessionComponent,
        AuthComponent,
        AnnotatorComponent,
        SelectorComponent,
        DurationPipe,
      ],
      imports: [
        BrowserModule,
        FormsModule,
        HttpModule
      ],
      providers: [SessionService, DataService, MonitorService],
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should have as title 'app'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('app');
  }));

  it('should render title in a header p tag', async(() => {
    // querySelector('#thing').outerHTML
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('header p').textContent).toContain('Alveo Transcription Tool');
  }));

  it('should show \'Logout\' only when logged in', async(() => {
    //component.sessionService.logIn();
    // querySelector('#thing').outerHTML
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    compiled.querySelector('#login-button').click();
    fixture.detectChanges();
    expect(compiled.querySelector('nav a').textContent).toContain('Logout');
  }));
});
