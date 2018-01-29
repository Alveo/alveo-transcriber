import { Component } from '@angular/core';

import { MatDialog } from '@angular/material';

import { Dialog } from './dialog/dialog.component';

import { AnnotatorService } from './shared/annotator.service';

@Component({
  selector: 'annotator',
  templateUrl: './annotator.component.html',
  styleUrls: ['./annotator.component.css'],
})

export class AnnotatorComponent {
  private viewMode = 'list';

  constructor(
    private dialog: MatDialog,
    private annotatorService: AnnotatorService,
  ) { }

  private setViewMode(mode: string) {
    this.viewMode = mode;
  }

  public getViewMode() {
    return this.viewMode;
  }

  public setSingleView() {
    this.setViewMode('single');
    this.annotatorService.annotationsEvent.emit({
      type: 'resize',
      newSize: 200,
    })
  }

  public setListView() {
    this.setViewMode('list');
    this.annotatorService.annotationsEvent.emit({
      type: 'resize',
      newSize: 120,
    })
  }

  public actionBack(): void {
    this.annotatorService.signalExit();
  }

  downloadFile(url, filename): void {
    // Create named DL
    const anchor = document.createElement('a');
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
    const csv = this.annotatorService.dumpCSV();

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    this.downloadFile(url, this.annotatorService.getAudioFileName() + '.csv');
  }

  exportJSON(): void {
    const csv = this.annotatorService.dumpJSON();

    const blob = new Blob([csv], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);

    this.downloadFile(url, this.annotatorService.getAudioFileName() + '.json');
  }

  dialogOpen(title: string, text: string): any {
    return this.dialog.open(Dialog, {data: {title: title, text: text}});
  }

  actionSegment(): void {
    const dialogStatus = this.dialogOpen('Warning',
      'Using the segmentor service will erase all regions/annotations and '
      + 'replace them with ones from an automatic segmentor. Deletion may '
      + 'be permanent. Do you wish to proceed?');
    dialogStatus.afterClosed().subscribe(result => {
      if (result === true) {
        this.annotatorService.signalAutoSegment();
      }
    });
  }

  getSelectedAnnotation(): any {
    return this.annotatorService.getSelectedAnnotation();
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


  public annotationEvent(ev: any): void {
    console.log(ev);
    if (event['type'] === 'select') {
      this.annotatorService.selectAnnotation(event['annotation']);
    } else if (event['type'] === 'edit') {
      this.annotatorService.emitUpdate();
    }
  }
}
