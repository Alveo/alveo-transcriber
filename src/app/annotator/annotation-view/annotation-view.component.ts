import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Annotation } from '../shared/annotation';

@Component({
  selector: 'annotation-view',
  templateUrl: './annotation-view.component.html',
  styleUrls: ['./annotation-view.component.css'],
})

export class AnnotationViewComponent {
  @Input() annotation: Annotation;
  @Output() annotationUpdate = new EventEmitter();
  @Output() playerControlEvent = new EventEmitter();

  constructor() { }

  public updateAnnotation(ev: any): void {
    if (this.annotation !== null) {
      this.annotationUpdate.emit(
        {
          "type": "edit",
          "annotation": this.annotation
        }
      );
    }
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
