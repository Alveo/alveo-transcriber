import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { MatDialog } from '@angular/material';

import { AlveoTranscriber } from '../../../../projects/alveo-transcriber/src/lib/alveo-transcriber.component';
import { Annotation } from '../../../../projects/alveo-transcriber/src/lib/shared/annotation';

import { AlveoClientService } from '../../alveo-client/alveo-client.module';
import { AlveoTransServClientService } from '../../alveo-transserv-client/alveo-transserv-client.module';
import { Transcription } from '../../transcription/transcription';
import { TranscriptionService } from '../../transcription/transcription.module';
import { RevisionSelectorComponent } from './revision-selector/revision-selector.component';
import { SessionService } from '../../session/session.service';
import { environment } from '../../../environments/environment';

import { AuthService } from '../shared/auth.service';
import { Paths } from '../shared/paths';

const UTC = '+0000';

@Component({
  selector: 'transcriber',
  templateUrl: './transcriber.component.html',
  styleUrls: ['./transcriber.component.css']
})
export class TranscriberComponent implements OnInit {
  private ready = false;
  private loader_text = '';
  private list_id = '';

  private item: any = null;
  private audioFileData: ArrayBuffer = null;
  public transcription: Transcription = null;
  private annotations: Array<Annotation> = [];
  private selectedAnnotation: Annotation = null;
  private defaultView = 'list';

  public isSegmenting = false;

  private item_id = '';
  private collection_id = '';

  public isReadOnly = false;

  public doc_id = '';
  public errorRaised = false;

  public lastEdit: number = null;
  public isSaving = false;

  @ViewChild(AlveoTranscriber) annotator: AlveoTranscriber;

  constructor(
    private atsService: AlveoTransServClientService,
    private transcriptionService: TranscriptionService,
    private alveoClientService: AlveoClientService,
    private sessionService: SessionService,
    public authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(
      (params: Params) => {
        this.loader_text = 'Loading ...';
        this.list_id = params['list_id'];
        this.collection_id = params['collection_id'];
        this.item_id = params['item_id'];
        this.doc_id = params['doc_id'];
        if (this.item_id === undefined) {
          this.sessionService.navigate([Paths.ListIndex]);
        } else {
          this.processData();
        }
      }
    );
  }

  private async processData(): Promise<any> {
    try {
      this.loader_text = 'Loading item ...';
      this.item = await this.prepareItem(this.collection_id + '/' + this.item_id);

      this.loader_text = 'Loading audio data ...';
      this.audioFileData = await this.prepareAudioFile(this.collection_id + '/' + this.item_id, this.doc_id);

      this.loader_text = 'Checking annotations ...';
      try {
        const transcription = await this.loadTranscription(this.getIdentifier());
        if (transcription === undefined) {
          this.annotations = [];
          this.transcription = new Transcription(null, new Array<Annotation>());
        } else {
          this.annotations = transcription.annotations;
          this.transcription = transcription;
          this.lastEdit = transcription.lastEdit;

          if (this.transcription.isPendingUpload && this.authService.isLoggedIn()) {
            await this.saveTranscription({annotations: this.annotations});
          }
        }
        this.ready = true;
      } catch (error) {
        this.ready = true;
      }
    } catch (error) {
      this.requestErrorHandler(error.message, error);
    }
  }

  public requestErrorHandler(message: string, error: any) {
    if (error.status === 401) {
      this.authService.promptLogin();
      this.raiseError('Not authenticated');
    } else if (error.status === 403) {
      this.raiseError('Licence must be accepted first. Please do so on the main website.');
    } else {
      this.sessionService.displayError(error.message, error);
    }
  }

  public getLoadingText(): string {
    return this.loader_text;
  }

  public isReady(): boolean {
    return this.ready;
  }

  public raiseError(message: string = 'An error has occurred'): void {
    this.errorRaised = true;
    this.loader_text = message;
  }

  private prepareItem(item_id: string): Promise<any> {
    return this.alveoClientService.getItem(item_id);
  }

  public getAudioFileUrl(): string {
    const path = environment.alveoPaths.mainUrl
      + '/' + environment.alveoPaths.itemSuffix
      + '/' + this.collection_id
      + '/' + this.item_id
      + '/document/' + this.doc_id;
    return path;
  }

  public getIdentifier(): string {
    if (this.item === null) {
      return null;
    }
    return this.item['alveo:metadata']['alveo:handle'];
  }

  private prepareAudioFile(item_id: string, doc_id: string): Promise<any> {
    return this.alveoClientService.getDocument(item_id, doc_id);
  }

  public getAudioFile() {
    return this.audioFileData;
  }

  public getAnnotations() {
    return this.annotations;
  }

  public getSelectedAnnotation() {
    return this.selectedAnnotation;
  }

  public getViewMode() {
    return this.defaultView;
  }

  public exit() {
    if (this.list_id !== '') {
      this.sessionService.navigate([Paths.ListView + '/' + this.list_id]);
    } else {
      this.sessionService.navigate([Paths.ListIndex]);
    }
  }

  public loadTranscription(identifier: string): Promise<any> {
    return this.transcriptionService.loadTranscription(identifier);
  }

  public saveTranscriptionLocal(identifier: string, transcription: Transcription): Promise<any> {
    return this.transcriptionService.saveTranscription(identifier, transcription);
  }

  public async saveTranscription(ev: any): Promise<any> {
    this.isSaving = true;
    this.transcription.remoteVersion = null;
    this.lastEdit = Date.now();
    const key = this.getIdentifier();
    const annotations = ev['annotations'];
    this.transcription.annotations = annotations;
    this.transcription.isPendingUpload = true;
    this.transcription.lastEdit = this.lastEdit;

    if (this.authService.isLoggedIn()) {
      try {
        const response = await this.atsService.pushRemoteStorage(
                                                      key,
                                                      annotations,
                                                      this.transcription.storageSpecification);
        this.transcription.remoteId = response.id;
        this.transcription.remoteVersion = response.version;
        const time = Date.parse(response['timestamp'] + UTC);
        this.transcription.lastEdit = time;
        this.transcription.isPendingUpload = false;
      } catch (e) {
        console.log('Error remotely saving transcriptions:', e);
      }
    }
    // Save locally only after saving remotely, so the remote_id is hopefully assigned
    await this.saveTranscriptionLocal(key, this.transcription);
    console.log('Transcription saved.');
    this.isSaving = false;
  }

  public async autoSegment(ev: any) {
    if (!this.authService.isLoggedIn()) {
      this.authService.promptLogin();
    } else {
      this.runSegmenter();
    }
  }

  private async runSegmenter() {
    this.isSegmenting = true;

    try {
      const remoteId = this.transcription.remoteId;
      const data = await this.atsService.autosegment(this.getAudioFileUrl());
      const annotations = await this.annotator.rebuild(data.results);
      this.annotations = annotations;
      this.transcription = new Transcription(remoteId, annotations);
      // Not important to update this since we're technically not saving after the segmentor runs
      //  Should we?
      // this.lastEdit = this.transcription.lastEdit;
      this.saveTranscriptionLocal(this.getIdentifier(), this.transcription);
    } catch (error) {
      this.sessionService.displayError(error.message, error);
      this.isSegmenting = false;
    } finally {
      this.isSegmenting = false;
    }
  }

  public promptRevisionChange(): void {
    if (this.dialog.openDialogs.length < 1) {
      const dialog = this.dialog.open(RevisionSelectorComponent, {
        data: {
          transcription: this.transcription
        }
      });
      dialog.afterClosed().subscribe(
        (response) => {
          if (response['transcription'] !== undefined) {
            this.selectRevision(response['transcription']);
          }
        }
      );
    }
  }

  private async selectRevision(transcription: Transcription): Promise<any> {
    try {
      const annotations = await this.annotator.rebuild(transcription.annotations);
      this.transcription = transcription;
      this.annotations = transcription.annotations;
      this.saveTranscriptionLocal(this.getIdentifier(), this.transcription);

      this.lastEdit = transcription.lastEdit;
    } catch (error) {
      this.sessionService.displayError(error.message, error);
    }
  }

  public checkChangesPending() {
    if (this.annotator !== undefined) {
      return this.annotator.changesPending;
    } else {
      return false;
    }
  }

  public onChanges(ev: any): void {
  }
}
