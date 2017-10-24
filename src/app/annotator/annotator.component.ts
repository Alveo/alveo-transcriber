import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material';

import { Dialog } from './dialog/dialog.component';

import { AnnotatorService } from './shared/annotator.service';
import { SegmentorService } from './shared/segmentor.service';

@Component({
  selector: 'annotator',
  templateUrl: './annotator.component.html',
  styleUrls: ['./annotator.component.css'],
})

export class AnnotatorComponent {
  constructor(
    public dialog: MatDialog,
    public router: Router,
    public segService: SegmentorService,
    public annotatorService: AnnotatorService,
  ) { }

  actionBack(): void {
    this.router.navigate(['/']);
  }

  downloadFile(url, filename): void {
    // Create named DL
    let anchor = document.createElement("a");
    anchor.download = filename;
    anchor.href = url;

    // Begin download
    window.document.body.appendChild(anchor);
    anchor.click();

    // Cleanup
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

  dialogOpen(title: string, text: string): any {
    return this.dialog.open(Dialog, {data: {title: title, text: text}});
  }

  actionSegment(): void {
    let dialogStatus = this.dialogOpen("Warning", "Using the segmentor service will erase all regions/annotations and replace them with ones from an automatic segmentor. Deletion may be permanent. Do you wish to proceed?");
    dialogStatus.afterClosed().subscribe(result => {
      console.log(result);
      if (result == true) {
        this.segService.segment(this.getAudioFileURL(),
          (data) => {
            this.annotatorService.rebuild(data.json());
          }
        );
      }
    });
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
