import { TestBed, async } from '@angular/core/testing';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AuthComponent } from './auth.component';
import { SessionService } from './session.service';

describe('AuthComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AuthComponent,
      ],
      imports: [
        BrowserModule,
        FormsModule,
        HttpModule
      ],
      providers: [SessionService],
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
