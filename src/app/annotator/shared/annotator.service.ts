import { Injectable, EventEmitter } from '@angular/core';

import { Annotation } from './annotation';

@Injectable()
export class AnnotatorService {
  public moduleEvent: EventEmitter<any> = new EventEmitter();
  public externalEvent: EventEmitter<any> = new EventEmitter();

  private audioFile: any;
  private audioFileName: string;

  private annotations: Array<Annotation> = [];

  public initialise(annotations: Array<Annotation>, audioFile: ArrayBuffer, audioFileName: string): any {
    this.audioFile = audioFile;
    this.audioFileName = audioFileName;
    this.annotations = annotations;
  }

  public rebuild(data: any): void {
    this.moduleEvent.emit(
      {
        'type': 'rebuild',
        'segments': data
      }
    );
  }

  public getAnnotations(): any {
    return this.annotations;
  }

  public getAudioFile(): any {
    return this.audioFile;
  }

  public getAudioFileName(): any {
    return this.audioFileName;
  }

  public save(annotations: Array<Annotation>): any {
    this.annotations = annotations;
    this.externalEvent.emit(
      {
        'type': 'save',
        'annotations': this.annotations
      }
    );
  }

  public signalExit(): any {
    this.externalEvent.emit(
      {
        'type': 'exit'
      }
    );
  }

  public signalAutoSegment(): any {
    this.externalEvent.emit(
      {
        'type': 'autosegment'
      }
    );
  }
}
