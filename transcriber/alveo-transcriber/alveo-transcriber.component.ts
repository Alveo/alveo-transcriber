import {
  Component,
  HostListener,
  ViewChild,
  OnInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { MatDialog } from '@angular/material';

import { DialogComponent } from '../dialog/dialog.component';
import { PlayerComponent } from '../player/player.component';

import { Annotation, ANNOTATION_CSV_FIELDS } from '../shared/annotation';

// Fix for module building
import * as json2csv_ from 'json2csv';
const json2csv = json2csv_;

@Component({
  selector: 'avl-ngt-transcriber',
  templateUrl: './alveo-transcriber.component.html',
  styleUrls: ['./alveo-transcriber.component.css'],
})

export class AlveoTranscriber implements OnInit {
  @Input() audioFile: any = null;
  @Input() audioFileName = 'null';
  @Input() annotations: Array<any> = [];
  @Input() selectedAnnotation: Annotation = null;
  @Input() viewMode = 'list';

  @Input() segmentorWorking = false;

  @Output() exit = new EventEmitter<any>();
  @Output() autosegment = new EventEmitter<any>();
  @Output() save = new EventEmitter<any>();

  @Input() showSegmentorServiceButton = false;
  @Input() showCSVExportButton = true;
  @Input() showJSONExportButton = true;
  @Input() autoPlay = true;

  public playerReady = false;

  @ViewChild(PlayerComponent) player: PlayerComponent;

  constructor(
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.sortAnnotations();
  }

  @HostListener('keydown') hotkeys(ev) {
    if (ev.keyCode === 27) {
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
  }

  public setListView(): void {
    this.setViewMode('list');
  }

  public actionBack(): void {
    this.exit.emit({});
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
    const csv = JSON.stringify({
      'doc_id': this.getAudioFileName(),
      'annotations': this.annotations
    }, null, 2);

    const blob = new Blob([csv], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);

    this.downloadFile(url, this.getAudioFileName() + '.json');
  }

  private dialogOpen(title: string, text: string): any {
    return this.dialog.open(DialogComponent, {data: {title: title, text: text}});
  }

  public actionSegment(): void {
    const dialogStatus = this.dialogOpen('Warning',
      'Using the segmentor service will erase all regions/annotations and '
      + 'replace them with ones from an automatic segmentor. Deletion may '
      + 'be permanent. Do you wish to proceed?');
    dialogStatus.afterClosed().subscribe(result => {
      if (result === true) {
        this.player.pause();
        this.autosegment.emit({});
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
    this.autoPlay = ev['checked'];
  }

  public onPlayerReady(ev: any): void {
    this.selectFirst();
    this.playerReady = true;
  }

  public playerControlEvent(ev: any): void {
    switch (ev['type']) {
      case 'golistview': {
        this.setListView();
        break;
      }
      case 'gosingleview': {
        this.setSingleView();
        break;
      }
      case 'replay': {
        this.player.replaySelectedRegion();
        break;
      }
      case 'goBack': {
        this.player.selectPreviousRegion();
        break;
      }
      case 'goNext': {
        this.player.selectNextRegion();
        break;
      }
      case 'delete': {
        this.player.deleteSelectedRegion().then(
          () => {
            this.selectAnnotation(null);
            this.saveAnnotations(this.annotations);
          }
        );
        break;
      }
    }
  }

  private saveAnnotations(annotations: Array<Annotation>) {
    this.save.emit(
      {
        'annotations': annotations
      }
    );
  }

  public annotationEvent(ev: any): void {
    switch (ev['type']) {
      case 'region-select': {
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
        // this.selectAnnotation(annotation, false);
        this.saveAnnotations(this.annotations);
      }
    }
  }

  private sortAnnotations(): void {
    this.annotations = this.annotations.sort(
      (left, right): number => {
        if (left.start < right.start) {
          return -1;
        }
        if (left.start > right.start) {
          return 1;
        }
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
      this.selectAnnotation(this.annotations[0], true, true);
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
