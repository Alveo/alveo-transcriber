import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AnnotatorService } from './shared/annotator.service';
import { SegmentorService } from './shared/segmentor.service';

@Component({
  selector: 'annotator',
  templateUrl: './annotator.component.html',
  styleUrls: ['./annotator.component.css'],
})

export class AnnotatorComponent {
  constructor(
    public router: Router,
    public segService: SegmentorService,
    public annotatorService: AnnotatorService,
  ) { }

  actionBack(): void {
    this.router.navigate(['/']);
  }

  actionSegment(): void {
    this.segService.segment(this.getAudioFileURL(),
      (data) => {
        this.annotatorService.rebuild(data.json());
      }
    );
  }

  getSelectedAnnotation(): any {
    return this.annotatorService.getAnnotations()[0];
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

  getAudioFileURL(): string {
    return this.annotatorService.getAudioFileURL();
  }
}
