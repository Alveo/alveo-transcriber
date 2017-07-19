import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  year: number;
  title = 'app';

  constructor() {
    this.year = new Date().getFullYear();
  }

  currentYear(): number {
    return this.year;
  }
}
