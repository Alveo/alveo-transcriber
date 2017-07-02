import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'app';

  loggedin = false;

  // The following should be in offline cache
  selecting = true;
  clip = 0;
  host_addr = "127.0.0.1:5000";
  clips = [];
}
