import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Observable';

import { AnnotatorService } from '../../annotator/shared/annotator.service';
import { Annotation } from '../../annotator/shared/annotator.service';
import { DBService, Databases } from './db.service';

@Injectable()
export class AnnotationsService {
  private annotatorWatcher: any = null;

  constructor(
    private annotatorService: AnnotatorService,
    private dbService: DBService) {}

  public getAnnotations(identifier: string): Promise<any> {
    return new Promise(
      (resolve, error) => {
        this.dbService.instance(Databases.Annotations).get(identifier)
          .then((data) => resolve(data['annotations']))
          .catch((error) => resolve([]))
      }
    );
  }

  public setAnnotations(docIdentifier: string, annotations: Array<Annotation>): Promise<any> {
    return this.dbService.instance(Databases.Annotations)
      .put(docIdentifier, {"annotations":annotations});
  }

  public watch(docIdentifier: string, watcher: any) {
    if (this.annotatorWatcher != null) {
      this.annotatorWatcher.unsubscribe();
      this.annotatorWatcher = null;
    }
    this.annotatorWatcher = watcher.subscribe((event:any) => {
      this.setAnnotations(docIdentifier, this.annotatorService.annotations);
    });
  }

  public prepareAnnotator(identifier: string, audioFile: ArrayBuffer, backUrl: Array<any>): Promise<any> {
    return new Promise(
      (resolve, reject) => {
        this.getAnnotations(identifier).then(
          (data) => {
            this.annotatorService.rebase(data);

            this.annotatorService.audioFile = audioFile;
            this.annotatorService.setBackUrl(backUrl);

            this.annotatorService.audioFileName = identifier;
            this.watch(identifier, this.annotatorService.annotationsUpdate);
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
