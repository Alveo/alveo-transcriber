import { Component } from '@angular/core';
import { SessionService } from './session.service';

@Component({
  selector: 'nav',
  templateUrl: './nav.component.html',
})

export class NavComponent {
  constructor(private sessionService: SessionService) { }
}
