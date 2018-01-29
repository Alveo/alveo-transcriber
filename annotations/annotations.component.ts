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

  constructor() { }

  ngOnChanges(changes: any): void {
    this.annotationUpdate.emit(
      {
        "type": "edit",
        "annotation": this.annotation
      }
    );
  }
}
