import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { Annotation } from '../../../../annotator/shared/annotation';
import { AnnotationService } from '../../../shared/annotation.service';

/* Display component for showing and selecting of docs
 *   Provides route for Annotator module */
@Component({
  selector: 'docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.css'],
})
export class DocsComponent implements OnInit {
  @Input() alveo_doc: any = null;
  @Output() onNavigate = new EventEmitter<any>();
  private annotations: Array<Annotation> = [];

  constructor(
    private annotationService: AnnotationService
  ) { }

  ngOnInit() {
    if (this.alveo_doc !== null) {
      this.annotationService.loadAnnotations(this.getDocName()).then(
        (annotations) => {
          this.annotations = annotations;
        }
      );
    }
  }

  public getDocName(): string {
    return this.alveo_doc['dcterms:identifier'];
  }

  public getAnnotationCount(): number {
    return this.annotations.length;
  }

  public navigate(): void {
    this.onNavigate.emit({});
  }
}
