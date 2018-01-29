import { Component, Input, Output, OnChanges, EventEmitter } from '@angular/core';

import { Annotation } from '../shared/annotator.service';

@Component({
  selector: 'annotation-list',
  templateUrl: './annotation-list.component.html',
  styleUrls: ['./annotation-list.component.css'],
})

export class AnnotationListComponent implements OnChanges {
  @Input() annotations: Array<Annotation>;
  @Input() selectedAnnotation: Annotation;
  @Output() annotationUpdate = new EventEmitter();
  @Output() playerControlEvent = new EventEmitter();

  constructor() {}

  public getSelectedAnnotation(): Annotation {
    return this.selectedAnnotation;
  }

  ngOnChanges(changes: any): void {
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
