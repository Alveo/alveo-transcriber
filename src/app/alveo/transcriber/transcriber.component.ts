import { Component, OnInit, ViewChild } from '@angular/core';

import { AnnotatorComponent } from '../../annotator/annotator.component'
import { Annotation } from '../../annotator/shared/annotation';
import { SegmentorService } from '../shared/segmentor.service';
import { DBService, Databases } from '../shared/db.service';

@Component({
  selector: 'transcriber',
  templateUrl: './transcriber.component.html',
  styleUrls: ['./transcriber.component.css']
})
export class TranscriberComponent implements OnInit {
  // doc as route input
  private ready: boolean = false;

  @ViewChild(AnnotatorComponent) annotator: AnnotatorComponent;

  constructor(
    private segmentorService: SegmentorService,
    private dbService: DBService) {
  }

  ngOnInit() {
    // route input for doc
  }

  getAudioFile() {
    //return this.
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
}
