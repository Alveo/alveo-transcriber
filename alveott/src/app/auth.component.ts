import { Component } from '@angular/core';
import { SessionService } from './session.service';

@Component({
  selector: 'auth',
  templateUrl: './auth.component.html',
})

export class AuthComponent {
  constructor(private sessionService: SessionService) { }
}
