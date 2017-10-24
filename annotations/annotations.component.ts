import { Component, Input } from '@angular/core';

@Component({
  selector: 'annotations',
  templateUrl: './annotations.component.html',
  styleUrls: ['./annotations.component.css'],
})

export class AnnotationsComponent {
  @Input() annotations: any;

  getSegmentsOrdered(): any {
    this.annotations.sort(function(a, b) {
      return a.start - b.start;
    });
    return this.annotations;
  }

  getActiveSegment(): any {
    return null;
  }

  setRegion(segment: any): void {
    //this.appService.audioPlayer.activeSegment = segment;
  }
}
