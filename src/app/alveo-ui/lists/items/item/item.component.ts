import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { AlveoTransServClientService } from '../../../../alveo-transserv-client/alveo-transserv-client.module';
import { AnnotationsService } from '../../../../annotations/annotations.module';
import { AuthService } from '../../../shared/auth.service';

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
  private remotelyStored: boolean = false;

  public audioSources: any = [];

  constructor(
    private annotationsService: AnnotationsService,
    private atsService: AlveoTransServClientService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.processAnnotationCount();
    if (this.authService.isLoggedIn()) {
      this.checkRemote();
    }

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
    } catch (error) {
      this.annotationCount = 0;
    }
  }

  public getAnnotationCount(): number {
    return this.annotationCount;
  }

  public async checkRemote(): Promise<any> {
    try {
      let response = await this.atsService.listRemoteStorageByKey(this.getAnnotationHandle());
      if (response.storage_objects.length > 0) {
        this.remotelyStored = true;
      }
    } catch(error) {
      this.remotelyStored = false;
      console.log(error);
      if (error.status === 401) {
      } else if (error.status === 404) {
      }
      else {
        console.log(error);
      }
    }
  }

  public async upload(): Promise<any> {
    try {
      const annotations = await this.annotationsService.loadAnnotations(this.getAnnotationHandle());
      let response = await this.atsService.pushRemoteStorage(this.getAnnotationHandle(), annotations);
      await this.processAnnotationCount();
      await this.checkRemote();
      console.log(response)
    } catch(error) {
      console.log(error);
    }
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
