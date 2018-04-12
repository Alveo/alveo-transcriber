import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Annotation } from '../shared/annotation';

@Component({
  selector: 'annotation-list-view',
  templateUrl: './annotation-list-view.component.html',
  styleUrls: ['./annotation-list-view.component.css'],
})

export class AnnotationListViewComponent {
  @Input() annotations: Array<Annotation>;
  @Output() annotationUpdate = new EventEmitter();
  @Output() playerControlEvent = new EventEmitter();

  private _selectedAnnotation: Annotation;
  @Input() private set selectedAnnotation(annotation: Annotation) {
    if (annotation != this._selectedAnnotation) {
      this.scrollToAnnotation(annotation);
    }
    this._selectedAnnotation = annotation;
  }
  private get selectedAnnotation(): Annotation {
    return this._selectedAnnotation;
  }

  constructor() { }

  public scrollToAnnotation(annotation: Annotation) {
    if (annotation !== null) {
      const elements = document.getElementsByClassName("annotation-forms");

      for (var i = 0; i < elements.length; i++) {
        if (elements[i].id === annotation.id) {
          elements[i].scrollIntoView();
        }
      }
    }
  }

  public getSelectedAnnotation(): Annotation {
    return this.selectedAnnotation;
  }

  public selectAnnotation(selectedAnnotation: Annotation): void {
    if (this.selectedAnnotation !== selectedAnnotation) {
      this.annotationClick(selectedAnnotation);
    }
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
