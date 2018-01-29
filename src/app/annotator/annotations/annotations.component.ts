import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Annotation } from '../shared/annotator.service';

@Component({
  selector: 'annotations',
  templateUrl: './annotations.component.html',
  styleUrls: ['./annotations.component.css'],
})

export class AnnotationsComponent {
  @Input() annotation: Annotation;
  @Output() annotationUpdate = new EventEmitter();
  @Output() playerControlEvent = new EventEmitter();

  constructor() { }

  public updateAnnotation(ev: any): void {
    if (this.annotation !== null) {
      console.log("Updated annotation");
      this.annotationUpdate.emit(
        {
          "type": "edit",
          "annotation": this.annotation
        }
      );
    }
  }

  public requestListView(): void {
    this.playerControlEvent.emit(
      {
        "type": "golistview"
      }
    );
  }

  public replayAnnotationRequest(): void {
    this.playerControlEvent.emit(
      {
        "type": "replay",
        "annotation": this.annotation
      }
    );
  }

  public nextAnnotationRequest(): void {
    this.playerControlEvent.emit(
      {
        "type": "goNext",
      }
    );
  }

  public backAnnotationRequest(): void {
    this.playerControlEvent.emit(
      {
        "type": "goBack",
      }
    );
  }

  public deleteAnnotationRequest(): void {
    this.playerControlEvent.emit(
      {
        "type": "delete",
        "annotation": this.annotation
      }
    );
  }
}
