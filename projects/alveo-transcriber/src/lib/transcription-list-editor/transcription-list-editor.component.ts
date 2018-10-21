import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Annotation } from '../shared/annotation';

@Component({
  selector: 'avl-ngt-transcription-list-editor',
  templateUrl: './transcription-list-editor.component.html',
  styleUrls: ['./transcription-list-editor.component.css'],
})

export class TranscriptionListEditorComponent {
  @Input() isReadOnly: boolean;
  @Input() annotations: Array<Annotation>;
  @Output() annotationUpdate = new EventEmitter();
  @Output() playerControlEvent = new EventEmitter();

  private _selectedAnnotation: Annotation;
  @Input() private set selectedAnnotation(annotation: Annotation) {
    if (annotation !== this._selectedAnnotation) {
      // Allow time to re-render
      //  Only needed after region created
      setTimeout(() => {
        if (annotation === this._selectedAnnotation) {
          this.scrollToAnnotation(annotation);
        }
      }, 50);
    }
    this._selectedAnnotation = annotation;
  }
  private get selectedAnnotation(): Annotation {
    return this._selectedAnnotation;
  }

  constructor() { }

  public scrollToAnnotation(annotation: Annotation) {
    if (annotation !== null) {
      const elements = document.getElementsByClassName('caption');

      for (let i = 0; i < elements.length; i++) {
        if (elements[i].id === annotation.id) {
          elements[i].scrollIntoView({behavior: 'smooth', block: 'start'});
          break;
        }
      }
    }
  }

  public getSelectedAnnotation(): Annotation {
    return this.selectedAnnotation;
  }

  public selectAnnotation(annotation: Annotation): void {
    if (this.selectedAnnotation !== annotation) {
      this.annotationClick(annotation);
    }
  }

  public updateAnnotation(annotation: Annotation): void {
    this.annotationUpdate.emit(
      {
        'type': 'edit',
        'annotation': annotation
      }
    );
  }

  public annotationClick(annotation: Annotation): void {
    this.annotationUpdate.emit(
      {
        'type': 'select',
        'annotation': annotation
      }
    );
  }

  public replayAnnotationRequest(annotation: Annotation): void {
    this.playerControlEvent.emit(
      {
        'type': 'replay',
        'annotation': annotation
      }
    );
  }

  public deleteAnnotationRequest(annotation: Annotation): void {
    this.playerControlEvent.emit(
      {
        'type': 'delete',
        'annotation': annotation
      }
    );
  }
}
