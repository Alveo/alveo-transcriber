import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Annotation } from '../shared/annotation';

@Component({
  selector: 'annotation-list-view',
  templateUrl: './annotation-list-view.component.html',
  styleUrls: ['./annotation-list-view.component.css'],
})

export class AnnotationListViewComponent {
  @Input() annotations: Array<Annotation>;
  @Input() selectedAnnotation: Annotation;
  @Output() annotationUpdate = new EventEmitter();
  @Output() playerControlEvent = new EventEmitter();

  constructor() {}

  public getSelectedAnnotation(): Annotation {
    return this.selectedAnnotation;
  }

  public updateAnnotation(ev: any): void {
    if (this.getSelectedAnnotation() !== null) {
      this.annotationUpdate.emit(
        {
          "type": "edit",
          "annotation": this.getSelectedAnnotation()
        }
      );
    }
  }

  public annotationClick(annotation: Annotation): void {
    if (annotation !== null) {
      this.annotationUpdate.emit(
        {
          "type": "select",
          "annotation": annotation
        }
      );
    }
  }

  public requestSingleView(): void {
    this.playerControlEvent.emit(
      {
        "type": "gosingleview"
      }
    );
  }

  public replayAnnotationRequest(): void {
    this.playerControlEvent.emit(
      {
        "type": "replay",
        "annotation": this.getSelectedAnnotation()
      }
    );
  }

  public deleteAnnotationRequest(): void {
    this.playerControlEvent.emit(
      {
        "type": "delete",
        "annotation": this.getSelectedAnnotation()
      }
    );
  }
}
