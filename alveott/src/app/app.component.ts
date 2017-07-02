import { Component } from '@angular/core';
import { SessionService } from './session.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  constructor(private sessionService: SessionService) { }

  title = 'app';

  loggedin = false;

  // The following should be in offline cache
  selecting = true;
  clip = 0;
  host_addr = "127.0.0.1:5000";
  clips = [];
}
