import { Injectable } from '@angular/core';

import { Annotation } from '@alveo-vl/angular-transcriber';
import { DBService, Databases } from './db.service';

/* Service for handling the database interaction for Annotations */
@Injectable()
export class AnnotationService {
  constructor(
    private dbService: DBService) {}

  public loadAnnotations(identifier: string): Promise<any> {
    return new Promise(
      (resolve, error) => {
        this.dbService.instance(Databases.Annotations).get(identifier)
          .then((data) => resolve(data['annotations']))
          .catch((error) => resolve([]))
      }
    );
  }

  public saveAnnotations(identifier: string, annotations: Array<Annotation>): Promise<any> {
    return this.dbService.instance(Databases.Annotations)
      .put(identifier, {'annotations': annotations});
  }
}
