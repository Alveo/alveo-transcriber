import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AnnotatorService } from './shared/annotator.service';

@Component({
  selector: 'annotator',
  templateUrl: './annotator.component.html',
  styleUrls: ['./annotator.component.css'],
})

export class AnnotatorComponent {
  constructor(
    public router: Router,
    public annotatorService: AnnotatorService,
  ) { }

  actionBack(): void {
    this.router.navigate(['/']);
  }

  getAnnotations(): any {
    return this.annotatorService.getAnnotations();
  }

  getAudioFile(): any {
    return this.annotatorService.getAudioFile();
  }

  getAudioFileName(): string {
    return this.annotatorService.getAudioFileName();
  }
}
