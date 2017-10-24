import { Injectable } from '@angular/core';

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
  audioFile: any;
  audioFileName: string;
  audioFileURL: string;
  annotations: any;

  getAnnotations(): any {
    //return this.annotations;
    let a = [
      new Annotation(0.00, 3.20, "Test", "Test"),
      new Annotation(4.00, 8.20, "Test", "Test")
    ];
    return a;
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
