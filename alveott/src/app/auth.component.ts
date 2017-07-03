import { Component } from '@angular/core';
import { SessionService } from './session.service';

@Component({
  selector: 'auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})

export class AuthComponent {
  constructor(public sessionService: SessionService) { }
}
