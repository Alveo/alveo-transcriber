import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AlveoService } from '../alveo/shared/alveo.service';

@Component({
  selector: 'annotator',
  templateUrl: './annotator.component.html',
  styleUrls: ['./annotator.component.css'],
})

export class AnnotatorComponent {
  constructor(
    public router: Router,
    public alveoService: AlveoService,
  ) { }

  actionBack(): void {
    this.router.navigate(['./dataview']);
  }

  getClip(): any {
    return this.alveoService.audioData;
  }

  getClipName(): string {
    return "";
  }
}
