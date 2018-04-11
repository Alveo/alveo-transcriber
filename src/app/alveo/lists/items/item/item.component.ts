import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { AnnotationService } from '../../../shared/annotation.service';

/* Display component for showing and selecting of docs
 *   Provides route for Annotator module */
@Component({
  selector: 'item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css'],
})
export class ItemComponent implements OnInit {
  @Input() item: any = null;
  @Output() onTranscribe = new EventEmitter<any>();
  private annotationCount: number = 0;
  private selectedDoc: any = null;

  constructor(
    private annotationService: AnnotationService
  ) { }

  ngOnInit() {
    this.annotationService.loadAnnotations(this.getAnnotationHandle()).then(
      (annotations) => {
        this.annotationCount = annotations.length;
      }
    );
  }

  public getAnnotationCount(): number {
    return this.annotationCount;
  }

  public getDocumentCount(): number {
    return this.getDocuments().length;
  }

  private getAnnotationHandle(): string {
    return this.item['data']['alveo:metadata']['alveo:handle'];
  }

  private getDocuments(): any {
    return this.item['data']['alveo:documents'];
  }

  public getItemIdentifier(): string {
    return this.item['id'];
  }

  public getItemUrl(): string {
    return this.item['url'];
  }

  public transcribeAction(): void {
    console.log(this.selectedDoc);
    this.onTranscribe.emit({
      "doc_id": null, // TODO this.selectedDoc['dcterms:identifier'],
      "doc": null // TODO this.selectedDoc
    });
  }
}
