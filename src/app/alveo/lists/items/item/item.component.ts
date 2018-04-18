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
  @Output() transcribe = new EventEmitter<any>();
  private annotationCount = 0;
  private selectedSource: any = null;

  public audioSources: any = [];

  constructor(
    private annotationService: AnnotationService
  ) { }

  ngOnInit() {
    this.annotationService.loadAnnotations(this.getAnnotationHandle()).then(
      (annotations) => {
        this.annotationCount = annotations.length;
      }
    );

    for (const doc of this.item['data']['alveo:documents']) {
      // Need to force lower case as some Alveo collections use titlecase at the moment
      if (doc['dcterms:type'].toLowerCase() === 'audio') {
        this.audioSources.push(doc);
      }
    }
  }

  public getAnnotationCount(): number {
    return this.annotationCount;
  }

  private getAnnotationHandle(): string {
    return this.item['data']['alveo:metadata']['alveo:handle'];
  }

  private getAudioSources(): any {
    return this.audioSources;
  }

  public getItemIdentifier(): string {
    return this.item['id'];
  }

  public getItemUrl(): string {
    return this.item['url'];
  }

  public onTranscribe(): void {
    this.transcribe.emit(this.selectedSource);
  }
}
