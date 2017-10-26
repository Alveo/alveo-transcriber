import { CsvService } from "angular2-json2csv";

import { Injectable, EventEmitter } from '@angular/core';

export class Annotation {
  id: string;
  start: number;
  end: number;
  speaker: string;
  annotation: string;

  constructor(id: string,
              start: number, end: number,
              speaker: string, annotation: string) {
    this.id = id;
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
        segment.start, segment.end, "", ""));

      counter += 1;
    }
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
