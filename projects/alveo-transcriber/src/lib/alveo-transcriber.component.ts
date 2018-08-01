import {
  Component,
  HostListener,
  ViewChild,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { MatDialog } from '@angular/material';

import * as _ from 'lodash';

import { DialogComponent } from './dialog/dialog.component';
import { PlayerComponent } from './player/player.component';

import { Annotation } from './shared/annotation';
import { AnnotationExporterService } from './shared/annotation-exporter.service';

@Component({
  selector: 'avl-ngt-transcriber',
  templateUrl: './alveo-transcriber.component.html',
  styleUrls: ['./alveo-transcriber.component.css'],
})
export class AlveoTranscriber implements OnInit, OnDestroy {
  @Input() audioFile: any = null;
  @Input() audioFileName = 'null';
  @Input() annotations: Array<any> = [];
  private annotationsLast: Array<any> = [];
  @Input() selectedAnnotation: Annotation = null;
  @Input() viewMode = 'list';
  @Input() isReadOnly = true;

  @Input() segmentorWorking = false;

  @Output() exit = new EventEmitter<any>();
  @Output() autosegment = new EventEmitter<any>();
  @Output() save = new EventEmitter<any>();
  @Output() changes = new EventEmitter<any>();

  @Input() showSegmentorServiceButton = false;
  @Input() showCSVExportButton = true;
  @Input() showJSONExportButton = true;
  @Input() showWebVTTExportButton = true;
  @Input() autoPlay = true;

  private saveMonitor: any = null;
  public changesPending = false;
  @Input() changesBeforeForceSave = 40;
  @Input() secondsBeforeForceSave = 5;
  private changesSinceLastSave = 0;
  private secondsSinceInitialAction: number;

  public playerReady = false;

  @ViewChild(PlayerComponent) player: PlayerComponent;

  constructor(
    private dialog: MatDialog,
    private annotationExporter: AnnotationExporterService
  ) { }

  ngOnInit() {
    this.sortAnnotations();
    this.annotationsLast = this.annotations;

    this.saveMonitor = setInterval(() => {
      if (this.changesPending) {
        const seconds_elapsed = (Date.now() - this.secondsSinceInitialAction) / 1000;
        if (seconds_elapsed > this.secondsBeforeForceSave || this.changesSinceLastSave >= this.changesBeforeForceSave) {
          if (_.isEqual(this.annotationsLast, this.annotations)) {
            this.save.emit({'annotations': this.annotations});
            this.annotationsLast = this.annotations;
          }
          this.changesPending = false;
          this.changesSinceLastSave = 0;
        }
      }
    }, 1000);
  }

  ngOnDestroy() {
    clearInterval(this.saveMonitor);
  }

  @HostListener('document:keydown', ['$event'])
  hotkeys(ev: KeyboardEvent) {
    const annotation = this.getSelectedAnnotation();
    if (ev.key === "Escape") {
      if (annotation !== null) {
        this.player.replayAnnotation(annotation);
      }
    }
    if (ev.key === "Delete") {
      if (annotation !== null) {
        this.promptDelete(annotation);
      }
    }
  }

  private async promptDelete(annotation: Annotation): Promise<any> {
    if (this.isReadOnly) {
      console.log("Warning: attempting to delete annotation in readonly mode. Ignoring.");
      return;
    }
    const dialogStatus = this.dialogOpen('Warning', 'Are you sure you wish to delete this segment?');
    const confirmed = await dialogStatus.afterClosed().toPromise();
    if (confirmed) {
      if (annotation === null) {
        console.log("Warning: Attempting to delete invalid region. Possibly already deleted?");
      } else {
        this.player.deleteAnnotation(annotation);
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

  public async actionBack(): Promise<any> {
    if (this.changesPending) {
      const dialogStatus = this.dialogOpen('Warning',
        'There are unsaved changes. Discard them?');
      const confirmed = await dialogStatus.afterClosed().toPromise();
      if (confirmed) {
        this.quit();
      }
    } else {
      this.quit();
    }
  }

  // Should only be called via actionBack()
  private quit(): void {
    this.exit.emit({});
  }

  public exportCSV(): void {
    this.annotationExporter.asCSV(this.getAudioFileName() + '.csv', this.annotations);
  }

  public exportJSON(): void {
    this.annotationExporter.asJSON(this.getAudioFileName() + '.json', this.annotations);
  }

  public exportWebVTT(): void {
    this.annotationExporter.asWebVTT(this.getAudioFileName() + '.vtt', this.annotations);
  }

  private dialogOpen(title: string, text: string): any {
    return this.dialog.open(DialogComponent, {data: {title: title, text: text}});
  }

  public async actionSegment(): Promise<any> {
    const dialogStatus = this.dialogOpen('Warning',
      'Using the segmentor service will erase all regions/annotations and '
      + 'replace them with ones from an automatic segmentor. Deletion may '
      + 'be permanent. Do you wish to proceed?');
    const confirmed = await dialogStatus.afterClosed().toPromise();
    if (confirmed) {
      this.player.pause();
      this.autosegment.emit({});
    }
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
        this.player.replayAnnotation(ev['annotation']);
        break;
      }
      case 'goBack': {
        this.selectPreviousAnnotation();
        break;
      }
      case 'goNext': {
        this.selectNextAnnotation();
        break;
      }
      case 'delete': {
        if (ev['annotation'] !== null) {
          this.promptDelete(ev['annotation']);
        }
        break;
      }
    }
  }

  private selectPreviousAnnotation() {
    let beginning = null;
    if (this.selectedAnnotation === null) {
      beginning = this.player.getCurrentTime();
    } else {
      beginning = this.selectedAnnotation.start;
    }
    let lower = 0;

    let prevAnnotation = null;
    if (this.annotations.length > 0) {
      let prevAnnotation = this.annotations[0];
    }

    for (const annotation of this.annotations) {
      if (annotation.start < beginning) {
        if (lower < annotation.start) {
          lower = annotation.start;
          prevAnnotation = annotation;
        }
      }
    }

    this.selectAnnotation(prevAnnotation);
  }

  public selectNextAnnotation() {
    let beginning = null;
    if (this.selectedAnnotation === null) {
      beginning = this.player.getCurrentTime();
    } else {
      beginning = this.selectedAnnotation.start;
    }
    let higher = this.player.getAudioDuration();

    let nextAnnotation = null;

    for (const annotation of this.annotations) {
      if (annotation.start > beginning) {
        if (higher > annotation.start) {
          higher = annotation.start;
          nextAnnotation = annotation;
        }
      }
    }

    this.selectAnnotation(nextAnnotation);
  }

  private saveAnnotations() {
    if (this.isReadOnly) {
      console.log("Warning: attempting to save annotations in readonly mode. Ignoring.");
      return;
    }

    this.changes.emit({});

    this.secondsSinceInitialAction = Date.now();
    this.changesSinceLastSave += 1;
    this.changesPending = true;
  }

  public annotationEvent(ev: any): void {
    let annotation = ev['annotation']
    switch (ev['type']) {
      case 'select': {
        this.selectAnnotation(annotation);
        break;
      }
      case 'edit': {
        this.saveAnnotations();
        break;
      }
      case 'resize':
      case 'update-end': {
        if (!this.isReadOnly) {
          annotation.start = ev['new-start'];
          annotation.end = ev['new-end'];
          this.sortAnnotations();
          this.saveAnnotations();
          this.selectAnnotation(annotation, true);
        } else {
          console.log("Warning: attempting to resize annotation in readonly mode. Ignoring.");
        }
        break;
      }
      case 'create': {
        if (!this.isReadOnly) {
          const annotation = this.createAnnotationFromSegment(
              {
                'id': ev.id,
                'start': ev.start,
                'end': ev.end
              }
            );
          // Selection event made within PlayerComponent
          this.selectAnnotation(annotation, false);
          this.saveAnnotations();
        } else {
          console.log("Warning: attempting to create annotation in readonly mode. Ignoring.");
        }
        break;
      }
      case 'delete': {
        if (!this.isReadOnly) {
          this.deleteAnnotation(annotation);
          this.saveAnnotations();
        } else {
          console.log("Warning: attempting to create annotation in readonly mode. Ignoring.");
        }
        break;
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

  public rebuild(segments: any): Array<Annotation> {
    this.playerReady = false;
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

    this.player.buildRegions(this.annotations);
    this.selectFirst();

    return this.annotations;
  }

  public selectFirst(): void {
    if (this.annotations.length > 0) {
      this.selectAnnotation(this.annotations[0], true);
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

  public selectAnnotation(annotation: Annotation, ignoreAutoplay: boolean = false): void {
    this.player.selectAnnotation(annotation, ignoreAutoplay);

    this.selectedAnnotation = annotation;
  }

  public getSelectedAnnotation(): Annotation {
    return this.selectedAnnotation;
  }

  public deleteAnnotation(deletedAnnotation: Annotation): void {
    for (const annotation of this.annotations) {
      if (annotation === deletedAnnotation) {
        if (deletedAnnotation === this.getSelectedAnnotation()) {
          this.selectAnnotation(null);
        }

        const index = this.annotations.indexOf(annotation);
        if (index !== -1) {
          this.annotations.splice(index, 1);
        }

        break;
      }
    }
  }
}
