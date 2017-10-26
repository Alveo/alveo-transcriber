import { Component, Input, OnChanges } from '@angular/core';

import { Annotation } from '../shared/annotator.service';
import { AnnotatorService } from '../shared/annotator.service';

@Component({
  selector: 'annotations',
  templateUrl: './annotations.component.html',
  styleUrls: ['./annotations.component.css'],
})

export class AnnotationsComponent implements OnChanges {
  @Input() annotation: Annotation;

  constructor(
    public annotatorService: AnnotatorService
  ) { }

  ngOnChanges(changes: any): void {
    this.annotatorService.emitUpdate(); 
  }
}
