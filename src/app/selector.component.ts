import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AppUtilService } from './app-util.service';
import { DurationPipe } from './duration.pipe';

import { Clip } from './clip';

@Component({
  selector: 'selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.css'],
})

export class SelectorComponent {
  constructor(
    public router: Router,
    public appService: AppUtilService) { }

  onSelect(clip): void {
    this.appService.data.selected = clip;
    this.router.navigate(['./annotator']);
  }

  getClips(): Clip[] {
    return this.appService.data.clips;
  }
}
