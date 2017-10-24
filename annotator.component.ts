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

  downloadFile(url, filename): void {
    let anchor = document.createElement("a");
    anchor.download = filename;
    console.log(anchor.download);
    anchor.href = url;
    window.document.body.appendChild(anchor);
    anchor.click();
    window.document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }

  exportCSV(): void {
    let csv = this.annotatorService.dumpCSV();

    let blob = new Blob([csv], { type: 'text/csv' });
    let url = window.URL.createObjectURL(blob);

    this.downloadFile(url, this.annotatorService.getAudioFileName() + ".csv");
  }

  exportJSON(): void {
    let csv = this.annotatorService.dumpJSON();

    let blob = new Blob([csv], { type: 'application/json' });
    let url = window.URL.createObjectURL(blob);

    this.downloadFile(url, this.annotatorService.getAudioFileName() + ".json");
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
