import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'annotator',
  templateUrl: './annotator.component.html',
  styleUrls: ['./annotator.component.css'],
})

export class AnnotatorComponent {
  constructor(
    public router: Router,
  ) { }

  actionBack(): void {
    this.router.navigate(['./dataview']);
  }

  getClip(): any {
    //return this.alveoService.audioData;
    return null;
  }

  getClipName(): string {
    return "";
  }
}
