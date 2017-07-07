import { TestBed, async, inject } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthComponent } from './auth.component';

import { SessionService } from './session.service';

describe('AuthComponent', () => {
  let sessionService = new SessionService();
  let router = { navigate: jasmine.createSpy('navigate') };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AuthComponent],
      imports: [RouterTestingModule],
      providers: [
        {provide: Router, useValue: router},
        {provide: SessionService, useValue: sessionService},
      ]}).compileComponents();
  }));

  it('should show all the relevant elements', async(() => {
    const fixture = TestBed.createComponent(AuthComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('#welcome-text').textContent).toContain('Welcome');
    expect(compiled.querySelector('#login-button')).not.toBe(null);
  }));

  it('should expect to be logged out by default', async(() => {
    expect(sessionService.isLoggedIn()).toBe(false);
  }));

  it('should redirect set SessionService.loggedIn to true', async(() => {
    const fixture = TestBed.createComponent(AuthComponent);
    fixture.detectChanges();

    // Confirm there has been no redirection attempts
    expect(router.navigate).not.toHaveBeenCalled();

    // Attempt mock login
    const compiled = fixture.debugElement.nativeElement;
    compiled.querySelector('#login-button').click();
    fixture.detectChanges();

    // Confirm mock login redirects to selector route
    expect(router.navigate).toHaveBeenCalledWith(['./selector']);
  }));

  it('should expect to be logged in after having pressed the Login button', async(() => {
    expect(sessionService.isLoggedIn()).toBe(true);
  }));
});
