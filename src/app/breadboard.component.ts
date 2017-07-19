import { Component } from '@angular/core';
import { AppUtilService } from './app-util.service';

import { Clip } from './clip';

@Component({
  selector: 'breadboard',
  template: `
  <div style="text-align: center">
    <button (click)="this.click_remote()">Pull from remote</button>
    <button (click)="this.click_local()">Pull from local</button>
  </div>
  `,
})

export class BreadboardComponent {
  constructor(public appService: AppUtilService) {}

  click_remote(): void {
    this.appService.data.pull('http://127.0.0.1:5000/request-data');
    this.appService.audioService.pull('http://127.0.0.1:5000/request-audio');
    this.appService.data.startStore();
  }

  click_local(): void {
    this.appService.database.get("clips").then(results => {
      this.appService.data.clips = results.clips;
      console.log(results.clips);
    });
    this.appService.audioService.pull('http://127.0.0.1:5000/request-audio');
    this.appService.data.startStore();
  }
}
