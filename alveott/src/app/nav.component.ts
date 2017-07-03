import { Component } from '@angular/core';
import { SessionService } from './session.service';

@Component({
  selector: 'nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})

export class NavComponent {
  constructor(public sessionService: SessionService) { }
}
