import { Component, Input, Output, OnChanges, EventEmitter } from '@angular/core';

import { Annotation } from '../shared/annotator.service';

@Component({
  selector: 'annotations',
  templateUrl: './annotations.component.html',
  styleUrls: ['./annotations.component.css'],
})

export class AnnotationsComponent implements OnChanges {
  @Input() annotation: Annotation;
  @Output() annotationUpdate = new EventEmitter();
  @Output() playerControlEvent = new EventEmitter();

  constructor() { }

  ngOnChanges(changes: any): void {
    this.annotationUpdate.emit(
      {
        "type": "edit",
        "annotation": this.annotation
      }
    );
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
