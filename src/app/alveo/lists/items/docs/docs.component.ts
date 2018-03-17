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
  @Input() item_identifier: string = "";
  @Input() docs: Array<any> = [];
  @Output() onNavigate = new EventEmitter<any>();
  private annotations: Array<Annotation> = [];
  public selectedDoc: any = null;

  constructor(
    private annotationService: AnnotationService
  ) { }

  ngOnInit() {
    if (this.docs.length > 0) {
      this.selectedDoc = this.docs[0];
    }

    if (this.item_identifier !== "") {
      this.annotationService.loadAnnotations(this.item_identifier).then(
        (annotations) => {
          this.annotations = annotations;
        }
      );
    }
  }

  public getDocumentCount(): number {
    return this.docs.length;
  }

  public getAnnotationCount(): number {
    return this.annotations.length;
  }

  public select(): void {
    this.onNavigate.emit({
      "doc_id": this.selectedDoc['dcterms:identifier'],
      "doc": this.selectedDoc
    });
  }
}
