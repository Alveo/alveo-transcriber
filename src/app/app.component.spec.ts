import { TestBed, async } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { NavComponent } from './nav.component';
import { AuthComponent } from './auth.component';
import { SelectorComponent } from './selector.component';
import { AnnotatorComponent } from './annotator.component';
import { BreadboardComponent } from './breadboard.component';
import { PlayerComponent } from './player.component';
import { AnnotationsComponent } from './annotations.component';

import { SessionService } from './session.service';
import { DataService } from './data.service';
import { MonitorService } from './monitor.service';
import { PlayerControlService } from './player-control.service';
import { DBService } from './db.service';

import { AnnotationPipe } from './annotation.pipe';
import { DurationPipe } from './duration.pipe';
import { DurationShortPipe } from './duration-short.pipe';

import { AppRoutingModule } from './app-routing.module';

describe('AppComponent', () => {
  let sessionService = new SessionService();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        NavComponent,
        BreadboardComponent,
        AuthComponent,
        AnnotatorComponent,
        SelectorComponent,
        PlayerComponent,
        AnnotationsComponent,
        AnnotationPipe,
        DurationPipe,
        DurationShortPipe,
      ],
      imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        AppRoutingModule
      ],
      providers: [
        SessionService,
        DataService,
        MonitorService,
        DBService,
        {provide: SessionService, useValue: sessionService},
      ]}).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should have the title 'app'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('app');
  }));

  it('should render title in a header p tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('header p').textContent).toContain('Alveo Transcription Tool');
  }));

  // Bad idea to async call a test that depends on whenStable() (Angular4.2.5)
  it('should log in and take you to the selector view', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const compiled = fixture.debugElement.nativeElement;
    fixture.detectChanges();

    let path = TestBed.get(Router);
    path.navigate(['./login']);

    fixture.whenStable().then(() => {
      expect(compiled.querySelector('#welcome-text').textContent).toContain('Welcome');
      compiled.querySelector('#login-button').click();

      fixture.whenStable().then(() => {
        expect(compiled.querySelector('#subheader').textContent).toContain('Please select a clip to transcribe.');
      });
    });
    // console.log(compiled.innerHTML);
  });
});
