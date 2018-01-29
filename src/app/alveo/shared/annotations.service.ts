import { Injectable, EventEmitter } from '@angular/core';

import { AnnotatorService } from '../../annotator/shared/annotator.service';
import { Annotation } from '../../annotator/shared/annotation';
import { SegmentorService } from './segmentor.service';
import { DBService, Databases } from './db.service';

@Injectable()
export class AnnotationsService {
  private annotationsEvent: any = null;
  private annotatorEvent: any = null;

  private docIdentifier = '';
  private fileUrl = '';

  public serviceEvent: EventEmitter<any> = new EventEmitter();

  constructor(
    private annotatorService: AnnotatorService,
    private segmentorService: SegmentorService,
    private dbService: DBService) {}

  public setFileUrl(url: string) {
    this.fileUrl = url;
  }

  public getAnnotations(identifier: string): Promise<any> {
    return new Promise(
      (resolve, error) => {
        this.dbService.instance(Databases.Annotations).get(identifier)
          .then((data) => resolve(data['annotations']))
          .catch((error) => resolve([]))
      }
    );
  }

  private autoSegment(fileUrl: string) {
    if (fileUrl === '') {
      //raise exc
    }

    this.segmentorService.segment(fileUrl,
      (data) => {
        this.annotatorService.rebuild(data.json());
        this.setAnnotations(this.docIdentifier, data.json());
      }
    );
  }

  public setAnnotations(docIdentifier: string, annotations: Array<Annotation>): Promise<any> {
    return this.dbService.instance(Databases.Annotations)
      .put(docIdentifier, {'annotations': annotations});
  }

  public watch(docIdentifier: string, annotatorWatcher: any) {
    if (this.annotatorEvent != null) {
      this.annotatorEvent.unsubscribe();
      this.annotatorEvent = null;
    }

    this.docIdentifier = docIdentifier;

    this.annotatorEvent = annotatorWatcher.subscribe((ev: any) => {
      if (ev['type'] === 'exit') {
        this.serviceEvent.emit('exit');
      } else if (ev['type'] === 'autosegment') {
        this.autoSegment(this.fileUrl);
      } else if (ev['type'] === 'save') {
        this.setAnnotations(docIdentifier, ev['annotations']);
      }
    });
  }

  public prepareAnnotator(identifier: string, audioFile: ArrayBuffer): Promise<any> {
    return new Promise(
      (resolve, reject) => {
        this.getAnnotations(identifier).then(
          (data) => {
            this.annotatorService.initialise(data, audioFile, identifier);

            this.watch(identifier,
              this.annotatorService.externalEvent
            );
            resolve();
          },
          (error) => {
            reject(error);
          }
        );
      }
    );
  }
}
