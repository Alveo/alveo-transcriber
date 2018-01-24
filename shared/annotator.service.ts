import { Injectable, EventEmitter } from '@angular/core';

import * as json2csv from 'json2csv';

const ANNOTATION_CSV_FIELDS = [
  "id",
  "start",
  "end",
  "speaker",
  "caption",
  "cap_type"
]

export class Annotation {
  id: string;
  start: number;
  end: number;
  speaker: string;
  caption: string;
  cap_type: string;

  cap_options: Array<string>;

  constructor(id: string,
              start: number= 0, end: number= 0,
              speaker: string= '', caption: string= '',
              cap_type: string= 'text') {
    this.id = id;
    this.start = start;
    this.end = end;
    this.speaker = speaker;
    this.caption = caption;
    this.cap_type = cap_type;

    this.cap_options = [
      'text', 'noise'
    ];
  }
}

@Injectable()
export class AnnotatorService {
  annotationsEvent: EventEmitter<any> = new EventEmitter();
  annotationsUpdate: EventEmitter<any> = new EventEmitter();
  externalEvent: EventEmitter<any> = new EventEmitter();

  audioFile: any;
  audioFileName: string;

  annotations: Array<Annotation> = [];

  selectedAnnotation: Annotation;

  public getSelectedAnnotation(): Annotation {
    return this.selectedAnnotation;
  }

  rebase(annotations: Array<Annotation>): any {
    this.annotations = annotations;
    this.sortAnnotations();
    this.selectFirst();
  }

  private sortAnnotations() {
    this.annotations = this.annotations.sort(
      (left,right):number => {
        if (left.start < right.start) return -1;
        if (left.start > right.start) return 1;
        return 0;
      }
    );
  }

  emitUpdate(): any {
    this.annotationsUpdate.emit({})
  }

  getAnnotations(): any {
    return this.annotations;
  }

  rebuild(segments: any): void {
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

    this.annotationsEvent.emit({'type': 'rebuild'});

    this.selectFirst();
  }

  selectFirst() {
    if (this.annotations.length > 0) {
      this.selectAnnotation(this.annotations[0]);
    } else {
      this.selectAnnotation(null);
    }
  }

  createAnnotationFromSegment(segment: any): string {
    console.log(segment['start']);
    this.annotations.push(new Annotation(
      segment['id'],
      segment['start'],
      segment['end'],
      segment['speaker'],
      segment['caption'],
      segment['cap_type']
    ));

    this.sortAnnotations();

    return segment['id'];
  }

  deleteAnnotationByID(id: string): boolean {
    for (const annotation of this.annotations) {
      if (annotation.id === id) {
        if (id = this.selectedAnnotation.id) {
          this.selectedAnnotation = null;
        }

        const index = this.annotations.indexOf(annotation);
        if (index !== -1) {
          this.annotations.splice(index, 1);
        }

        return true;
      }
    }
    return false;
  }

  getAnnotationByID(id: string): Annotation {
    for (const annotation of this.annotations) {
      if (annotation.id === id) {
        return annotation;
      }
    }
    return null;
  }

  selectAnnotation(annotation: Annotation) {
    const oldSelection = this.selectedAnnotation;
    this.selectedAnnotation = annotation;

    this.annotationsEvent.emit(
      {
        'type': 'selectAnnotation',
        'new': annotation,
        'old': oldSelection
      }
    );
  }

  dumpCSV(): string {
    return json2csv({
      data: this.annotations,
      fields: ANNOTATION_CSV_FIELDS
    });
  }

  dumpJSON(): any {
    return JSON.stringify(this.annotations, null, 2);
  }

  getAudioFile(): any {
    return this.audioFile;
  }

  getAudioFileName(): any {
    return this.audioFileName;
  }

  public signalExit(): any {
    this.externalEvent.emit('exit');
  }

  public signalAutoSegment(): any {
    this.externalEvent.emit('autosegment');
  }
}
