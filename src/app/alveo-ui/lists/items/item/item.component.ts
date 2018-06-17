import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { AnnotationsService } from '../../../../annotations/annotations.module';

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
    private annotationsService: AnnotationsService
  ) { }

  ngOnInit() {
    this.processAnnotationCount();

    for (const doc of this.item['data']['alveo:documents']) {
      // Need to force lower case as some Alveo collections use titlecase at the moment
      if (doc['dcterms:type'].toLowerCase() === 'audio') {
        this.audioSources.push(doc);
      }
    }
  }

  private async processAnnotationCount(): Promise<any> {
    try {
      const annotations = await this.annotationsService.loadAnnotations(this.getAnnotationHandle());
      this.annotationCount = annotations.length;
    } catch(error) {
      this.annotationCount = 0;
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
