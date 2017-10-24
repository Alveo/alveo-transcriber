import { Injectable } from '@angular/core';

@Injectable()
export class AnnotatorService {
  audioFile: any;
  annotations: Array<any>;

  getAnnotations(): any {
    return this.annotations;
  }

  getAudioFile(): any {
    return this.audioFile;
  }

  getAudioFileName(): any {
    return "null";
  }
}
