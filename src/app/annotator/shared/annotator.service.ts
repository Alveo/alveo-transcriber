import { CsvService } from "angular2-json2csv";

import { Injectable, EventEmitter } from '@angular/core';

export class Annotation {
  id: string;
  start: number;
  end: number;
  speaker: string;
  caption: string;
  cap_type: string;

  cap_options: Array<string>;

  constructor(id: string,
              start: number=0, end: number=0,
              speaker: string="", caption: string="",
              cap_type: string="text") {
    this.id = id;
    this.start = start;
    this.end = end;
    this.speaker = speaker;
    this.caption = caption;
    this.cap_type = cap_type;

    this.cap_options = [
      "text", "noise"
    ];
  }
}

@Injectable()
export class AnnotatorService {
  annotationsEvent:EventEmitter<any> = new EventEmitter();
  annotationsUpdate:EventEmitter<any> = new EventEmitter();

  audioFile: any;
  audioFileName: string;
  audioFileURL: string;

  annotations: Array<Annotation>;

  selectedAnnotation: Annotation;

  constructor(private csvService: CsvService) {}

  rebase(annotations: Array<Annotation>): any {
    this.annotations = annotations;
    this.selectFirst();
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

    for (let segment of segments) {
      this.createAnnotationFromSegment(
          {
            'id': counter.toString(),
            'start': parseFloat(segment.start),
            'end': parseFloat(segment.end),
          }
        );
      counter += 1;
    }

    this.annotationsEvent.emit({"type":"rebuild"});

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
    this.annotations.push(new Annotation(
      segment['id'],
      segment['start'],
      segment['end'],
      segment['speaker'],
      segment['caption'],
      segment['cap_type']
    ));

    return segment['id'];
  }

  deleteAnnotationByID(id: string): boolean {
    for (let annotation of this.annotations) {
      if (annotation.id == id) {
        if (id = this.selectedAnnotation.id) {
          this.selectedAnnotation = null;
        }

        let index = this.annotations.indexOf(annotation);
        if (index !== -1) {
          this.annotations.splice(index, 1);
        }

        return true;
      }
    }
    return false;
  }

  getAnnotationByID(id: string): Annotation {
    for (let annotation of this.annotations) {
      if (annotation.id == id) {
        return annotation;
      }
    }
    return null;
  }

  selectAnnotation(annotation: Annotation) {
    let oldSelection = this.selectedAnnotation;
    this.selectedAnnotation = annotation;

    this.annotationsEvent.emit(
      {
        "type": "selectAnnotation",
        "new": annotation,
        "old": oldSelection
      }
    );
  }

  dumpCSV(): string {
    return this.csvService.ConvertToCSV(this.dumpJSON());
  }

  dumpJSON(): string {
    return JSON.stringify(this.annotations, null, 2);
  }

  getAudioFile(): any {
    return this.audioFile;
  }

  getAudioFileName(): any {
    return this.audioFileName;
  }

  getAudioFileURL(): any {
    return this.audioFileURL;
  }
}
