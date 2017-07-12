import { Component } from '@angular/core';
import { DataService } from './data.service';
import { AudioService } from './audio.service';

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
  constructor(
    public dataService: DataService,
    public audioService: AudioService,
  ) {}

  click_remote(): void {
    this.dataService.pull('http://127.0.0.1:5000/request-data');
    this.audioService.pull('http://127.0.0.1:5000/request-audio');
    this.dataService.startStore();
  }

  click_local(): void {
    this.dataService.database.get("clips").then(results => {
      this.dataService.clips = results.clips;
      console.log(results.clips);
    });
    this.audioService.pull('http://127.0.0.1:5000/request-audio');
    this.dataService.startStore();
  }
}
