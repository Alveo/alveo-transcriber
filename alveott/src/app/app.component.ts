import { Component } from '@angular/core';
import { SessionService } from './session.service';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  constructor(public sessionService: SessionService, 
              public dataService: DataService) { }

  title = 'app';
}
