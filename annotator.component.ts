import { Component, ViewChild, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { MatDialog } from '@angular/material';

import { Dialog } from './dialog/dialog.component';
import { PlayerComponent } from './player/player.component';

import { Annotation, ANNOTATION_CSV_FIELDS } from './shared/annotation';

import * as json2csv from 'json2csv';

@Component({
  selector: 'annotator',
  templateUrl: './annotator.component.html',
  host: {'(window:keydown)': 'hotkeys($event)'},
  styleUrls: ['./annotator.component.css'],
})

export class AnnotatorComponent implements OnInit {
  @Input() audioFile: any = null;
  @Input() audioFileName: string = "null";
  @Input() annotations: Array<any> = [];
  @Input() selectedAnnotation: Annotation = null;
  @Input() viewMode: string = "list";

  @Input() segmentorWorking: boolean = false;

  @Output() onExit = new EventEmitter<any>();
  @Output() onAutosegment = new EventEmitter<any>();
  @Output() onSave = new EventEmitter<any>();

  @Input() showSegmentorServiceButton: boolean = false;
  @Input() showCSVExportButton: boolean = true;
  @Input() showJSONExportButton: boolean = true;
  @Input() autoplayDefault: boolean = true;

  public playerReady: boolean = false;

  @ViewChild(PlayerComponent) player: PlayerComponent;

  constructor(
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.sortAnnotations();
  }

  hotkeys(ev){
    if (ev.keyCode == 27) {
      if (this.selectedAnnotation !== null) {
        this.player.replaySelectedRegion();
      }
    }
  }

  private setViewMode(mode: string): void {
    this.viewMode = mode;
  }

  public getViewMode(): string {
    return this.viewMode;
  }

  public setSingleView(): void {
    this.setViewMode('single');
    this.player.resize(200);
  }

  public setListView(): void {
    this.setViewMode('list');
    this.player.resize(120);
  }

  public actionBack(): void {
    this.onExit.emit({});
  }

  private downloadFile(url, filename): void {
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

  public exportCSV(): void {
    const csv = json2csv({
      data: this.annotations,
      fields: ANNOTATION_CSV_FIELDS
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    this.downloadFile(url, this.getAudioFileName() + '.csv');
  }

  public exportJSON(): void {
    const csv = JSON.stringify(this.annotations, null, 2);
    JSON.stringify(this.annotations, null, 2);

    const blob = new Blob([csv], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);

    this.downloadFile(url, this.getAudioFileName() + '.json');
  }

  private dialogOpen(title: string, text: string): any {
    return this.dialog.open(Dialog, {data: {title: title, text: text}});
  }

  public actionSegment(): void {
    const dialogStatus = this.dialogOpen('Warning',
      'Using the segmentor service will erase all regions/annotations and '
      + 'replace them with ones from an automatic segmentor. Deletion may '
      + 'be permanent. Do you wish to proceed?');
    dialogStatus.afterClosed().subscribe(result => {
      if (result === true) {
        this.onAutosegment.emit({});
      }
    });
  }

  public getAnnotations(): any {
    return this.annotations;
  }

  public getAudioFile(): ArrayBuffer {
    return this.audioFile;
  }

  public getAudioFileName(): string {
    return this.audioFileName;
  }

  public replayCheckboxEvent(ev: any): void {
    if (ev['checked'] === true) {
      this.player.autoPlay(true);
    } else {
      this.player.autoPlay(false);
    }
  }

  public onPlayerReady(ev: any): void {
    this.selectFirst();
    this.playerReady = true;
    this.player.autoPlay(this.autoplayDefault);
  }

  public playerControlEvent(ev: any): void {
    switch (ev['type']) {
      case "golistview": {
        this.setListView();
        break;
      }
      case "gosingleview": {
        this.setSingleView();
        break;
      }
      case "replay": {
        this.player.replaySelectedRegion();
        break;
      }
      case "goBack": {
        this.player.selectPreviousRegion();
        break;
      }
      case "goNext": {
        this.player.selectNextRegion();
        break;
      }
      case "delete": {
        this.player.deleteSelectedRegion().then(
          ()=> {
            this.selectAnnotation(null);
            this.saveAnnotations(this.annotations);
          }
        );
        break;
      }
    }
  }

  private saveAnnotations(annotations: Array<Annotation>) {
    this.onSave.emit(
      {
        'annotations': annotations
      }
    );
  }

  public annotationEvent(ev: any): void {
    switch (ev['type']) {
      case 'select-noemit': {
        this.selectAnnotation(ev['annotation'], false);
        break;
      }
      case 'select': {
        this.selectAnnotation(ev['annotation']);
        break;
      }
      case 'edit': {
        this.saveAnnotations(this.annotations);
        break;
      }
      case 'update': {
        this.sortAnnotations();
        this.saveAnnotations(this.annotations);
        break;
      }
      case 'create': {
        const annotation = this.createAnnotationFromSegment(
            {
              'id': ev.id,
              'start': ev.start,
              'end': ev.end
            }
          );
        // Selection event made within PlayerComponent
        //this.selectAnnotation(annotation, false);
        this.saveAnnotations(this.annotations);
      }
    }
  }

  private sortAnnotations(): void {
    this.annotations = this.annotations.sort(
      (left, right): number => {
        if (left.start < right.start) return -1;
        if (left.start > right.start) return 1;
        return 0;
      }
    );
  }

  public rebuild(segments: any): Promise<any> {
    return new Promise(
      (resolve, reject) => {
        this.annotations = [];
        let counter = 0;

        for (const segment of segments) {
          this.createAnnotationFromSegment(
              {
                'id': counter.toString(),
                'start': parseFloat(segment.start),
                'end': parseFloat(segment.end),
              }
            );
          counter += 1;
        }

        this.player.rebuild(this.annotations);
        this.selectFirst();

        resolve(this.annotations);
      }
    );
  }

  public selectFirst(): void {
    if (this.annotations.length > 0) {
      this.selectAnnotation(this.annotations[0], true, false);
    } else {
      this.selectAnnotation(null);
    }
  }

  public createAnnotationFromSegment(segment: any): Annotation {
    const annotation = new Annotation(
      segment['id'],
      segment['start'],
      segment['end'],
      segment['speaker'],
      segment['caption'],
      segment['cap_type']
    );

    this.annotations.push(annotation);
    this.sortAnnotations();

    return annotation;
  }

  // Silently param prevents audio from playing even when autoPlay is checked.
  //  This is mainly used after autosegmenting or after the transcriber is ready.
  public selectAnnotation(annotation: Annotation, emit: boolean = true, silently: boolean = false): void {
    const oldSelection = this.selectedAnnotation;
    this.selectedAnnotation = annotation;

    if (emit) {
      this.player.selectAnnotation(
        {
          'new': annotation,
          'old': oldSelection,
          'silently': silently
        }
      );
    }
  }

  public getSelectedAnnotation(): Annotation {
    return this.selectedAnnotation;
  }
}
