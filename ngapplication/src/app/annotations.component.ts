import { Component, Input } from '@angular/core';

import { PlayerControlService } from './player-control.service';

import { Clip } from './clip';
import { Segment } from './segment';

@Component({
  selector: 'annotations',
  templateUrl: './annotations.component.html',
  styleUrls: ['./annotations.component.css'],
})

export class AnnotationsComponent {
  constructor(public playCtrlService: PlayerControlService) { }

  @Input() clip: Clip;

  getSegmentsOrdered(): Array<Segment> {
    this.clip.segments.sort(function(a, b) {
      return a.start - b.start;
    });
    return this.clip.segments;
  }

  setRegion(segment: Segment): void {
    this.playCtrlService.activeSegment = segment;
  }
}
