import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from './session.service';

@Component({
  selector: 'auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})

export class AuthComponent {
  constructor(
    public router: Router,
    public sessionService: SessionService) { }

  login(): void {
    this.sessionService.login();

    // And if successful (Not implemented)
    this.router.navigate(['./selector']);
  }
}
