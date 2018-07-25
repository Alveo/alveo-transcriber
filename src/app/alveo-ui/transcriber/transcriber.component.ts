import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { MatDialog } from '@angular/material';

import { AlveoTranscriber, Annotation } from 'alveo-transcriber';

import { AlveoClientService } from '../../alveo-client/alveo-client.module';
import { AlveoTransServClientService } from '../../alveo-transserv-client/alveo-transserv-client.module';
import { AnnotationsService } from '../../annotations/annotations.module';
import { RevisionSelectorComponent } from './revision-selector/revision-selector.component';
import { SessionService } from '../../session/session.service';
import { environment } from '../../../environments/environment';

import { AuthService } from '../shared/auth.service';
import { Paths } from '../shared/paths';

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
  private annotations: Array<Annotation> = [];
  private selectedAnnotation: Annotation = null;
  private defaultView = 'list';

  private isSegmenting = false;

  private item_id = '';
  private collection_id = '';

  private isReadOnly = false;

  public doc_id = '';
  public errorRaised = false;

  public lastSave: number = null;
  public isSaving = false;

  @ViewChild(AlveoTranscriber) annotator: AlveoTranscriber;

  constructor(
    private atsService: AlveoTransServClientService,
    private annotationsService: AnnotationsService,
    private alveoClientService: AlveoClientService,
    private sessionService: SessionService,
    private authService: AuthService,
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
        const annotations = await this.loadAnnotations(this.getIdentifier());
        if (annotations === undefined) {
          this.annotations = [];
        } else {
          this.annotations = annotations;
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

  public loadAnnotations(identifier: string): Promise<any> {
    return this.annotationsService.loadAnnotations(identifier);
  }

  public async saveAnnotations(ev: any): Promise<any> {
    this.isSaving = true;
    this.lastSave = Date.now();
    const key = this.getIdentifier();
    const transcription = ev['annotations'];
    await this.annotationsService.saveAnnotations(key, transcription);
    if (this.authService.isLoggedIn()) {
      await this.atsService.pushRemoteStorage(key, transcription);
    }
    this.isSaving = false;
  }

  private async autoSegment(ev: any) {
    if (!this.authService.isLoggedIn()) {
      this.authService.promptLogin();
    } else {
      this.runSegmenter();
    }
  }

  private async runSegmenter() {
    this.isSegmenting = true;

    try {
      const data = await this.atsService.autosegment(this.getAudioFileUrl());
      const annotations = await this.annotator.rebuild(data.results);
      this.annotations = annotations;
      this.annotationsService.saveAnnotations(this.getIdentifier(), annotations);
    } catch (error) {
      this.sessionService.displayError(error.message, error);
      this.isSegmenting = false;
    }
    this.isSegmenting = false;
  }

  private promptRevisionChange() {
    if (this.dialog.openDialogs.length < 1) {
      this.dialog.open(RevisionSelectorComponent, {
        data: {
        }
      });
    }
  }

  private checkChangesPending() {
    if (this.annotator !== undefined) {
      return this.annotator.changesPending;
    } else {
      return false;
    }
  }
}
