import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AppUtilService } from './app-util.service';

@Component({
  selector: 'annotator',
  templateUrl: './annotator.component.html',
  styleUrls: ['./annotator.component.css'],
})

export class AnnotatorComponent {
  constructor(
    public router: Router,
    public appService: AppUtilService,
  ) { }

  actionBack(): void {
    this.router.navigate(['./dataview']);
  }

  getClip(): any {
    return null;
  }

  getClipName(): string {
    return "";
  }

  getAudioData(): any {
    return null;
  }
}
