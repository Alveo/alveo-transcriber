import { Injectable } from '@angular/core';
import { Annotation } from 'alveo-transcriber';

import { Database } from './database';

/* Service for handling the database interaction for Annotations */
@Injectable()
export class AnnotationService {
  private database: Database;

  constructor() {
    this.database = new Database("annotation-service");
  }

  public destroyData(): Promise<any> {
    return this.database.rebuild();
  }

  public loadAnnotations(identifier: string): Promise<any> {
    return this.database.get(identifier);
  }

  public saveAnnotations(identifier: string, annotations: Array<Annotation>): Promise<any> {
    return this.database.put(identifier, {'annotations': annotations});
  }
}
