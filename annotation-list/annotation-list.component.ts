import { Component, Input, OnChanges, OnInit } from '@angular/core';

import { Annotation } from '../shared/annotator.service';
import { AnnotatorService } from '../shared/annotator.service';

@Component({
  selector: 'annotation-list',
  templateUrl: './annotation-list.component.html',
  styleUrls: ['./annotation-list.component.css'],
})

export class AnnotationListComponent implements OnChanges, OnInit {
  @Input() annotations: Array<Annotation>;
  private selectedAnnotation: Annotation = null;

  constructor(public annotatorService: AnnotatorService) {} 

  ngOnInit(): void {
    this.annotatorService.annotationsEvent.subscribe((event) => {
      if (event.type === "selectAnnotation") {
        if (event.new !== null) {
          this.selectedAnnotation = event.new;
        }
      }
    });
  }

  ngOnChanges(changes: any): void {
    console.log("update emitted");
    this.annotatorService.emitUpdate();
  }

  public annotationClick(annotation: Annotation): void {
    this.annotatorService.selectAnnotation(annotation);
  }

  public getSelectedAnnotation(): Annotation {
    return this.selectedAnnotation;
  }
}
