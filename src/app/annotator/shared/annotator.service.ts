import { CsvService } from "angular2-json2csv";

import { Injectable, EventEmitter } from '@angular/core';

export class Annotation {
  start: number;
  end: number;
  speaker: string;
  annotation: string;

  constructor(start: number, end: number,
              speaker: string, annotation: string) {
    this.start = start;
    this.end = end;
    this.speaker = speaker;
    this.annotation = annotation;
  }
}

@Injectable()
export class AnnotatorService {
  annotationsEvent:EventEmitter<any> = new EventEmitter();

  audioFile: any;
  audioFileName: string;
  audioFileURL: string;
  annotations: any;

  constructor(public csvService: CsvService) {}

  getAnnotations(): any {
    return this.annotations;
  }

  rebuild(segments: any): void {
    this.annotations = [];
    for (let segment of segments) {
      this.annotations.push(new Annotation(segment.start, segment.end, "", ""));
    }
    console.log(this.annotations);
    this.annotationsEvent.emit("rebuild");
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