import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { AlveoTransServClientService } from '../../../../alveo-transserv-client/alveo-transserv-client.module';
import { Transcription } from '../../../../transcription/transcription';
import { TranscriptionService } from '../../../../transcription/transcription.module';
import { AuthService } from '../../../shared/auth.service';

const UTC = "+0000"; // TODO as environment variable, or add conversion function somewhere

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
  private selectedSource: any= null;
  private transcription: Transcription= null;

  public audioSources: any = [];

  constructor(
    private transcriptionService: TranscriptionService,
    private atsService: AlveoTransServClientService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.load();

    for (const doc of this.item['data']['alveo:documents']) {
      // Need to force lower case as some Alveo collections use titlecase at the moment
      if (doc['dcterms:type'].toLowerCase() === 'audio') {
        this.audioSources.push(doc);
      }
    }
  }

  private async load(): Promise<any> {
    try {
      this.transcription = await this.transcriptionService.loadTranscription(this.getAnnotationHandle());
      if (this.authService.isLoggedIn()) {
        await this.fetchRemote();
      }
    } catch (error) {
      console.log(error);
    }
  }

  public getAnnotationCount(): number {
    return this.annotationCount;
  }

  public async fetchRemote(): Promise<any> {
    try {
      console.log("Attempting remote object sync");
      let response = await this.atsService.listRemoteStorage(this.getAnnotationHandle());
      const objects = response.storage_objects;
      if (objects.length > 0) {
        if (this.transcription == null
          || (this.transcription.remoteVersion != null
              && objects[0].version > this.transcription.remoteVersion
             )
          )
        {
          response = await this.atsService.getRemoteStorage(response.storage_objects[0]['id']);

          const time = Date.parse(response['timestamp']+UTC);
          let transcription = new Transcription(
            response['id'],
            response['transcription'],
            time,
            response['version']
          );

          this.transcription = transcription;

          await this.transcriptionService.saveTranscription(this.getAnnotationHandle(), transcription);
          console.log("Object remote sync OK");
        } else {
          console.log("Object auto sync declined, conditions not met");
        }
      }
    } catch(error) {
      if (error.status === 401) {
        console.log("Can't sync, not authed");
      } else if (error.status === 404) {
        console.log("Can't sync, not authed");
      }
      else {
        console.log(error);
      }
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
