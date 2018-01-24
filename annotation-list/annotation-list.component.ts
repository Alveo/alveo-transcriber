import { Component, Input, OnChanges } from '@angular/core';

import { Annotation } from '../shared/annotator.service';
import { AnnotatorService } from '../shared/annotator.service';

@Component({
  selector: 'annotation-list',
  templateUrl: './annotation-list.component.html',
  styleUrls: ['./annotation-list.component.css'],
})

export class AnnotationListComponent implements OnChanges {
  @Input() annotations: Array<Annotation>;

  constructor(
    public annotatorService: AnnotatorService
  ) { }

  ngOnChanges(changes: any): void {
    this.annotatorService.emitUpdate();
  }
}
