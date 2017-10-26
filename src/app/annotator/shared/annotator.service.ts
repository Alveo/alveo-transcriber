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
              start: number, end: number,
              speaker: string, caption: string,
              cap_type: string) {
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

  audioFile: any;
  audioFileName: string;
  audioFileURL: string;

  annotations: Array<Annotation>;

  selectedAnnotation: Annotation;

  constructor(private csvService: CsvService) {}

  getAnnotations(): any {
    return this.annotations;
  }

  rebuild(segments: any): void {
    this.annotations = [];
    let counter = 0;

    for (let segment of segments) {
      this.annotations.push(new Annotation(
        counter.toString(),
        segment.start, segment.end, "", "", "text"));

      counter += 1;
    }
    this.annotationsEvent.emit("rebuild");
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
    this.selectedAnnotation = annotation;
    this.annotationsEvent.emit("selectAnnotation");
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
