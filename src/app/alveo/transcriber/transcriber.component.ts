import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AlveoTranscriber, Annotation } from 'alveo-transcriber';

import { ApiService } from '../shared/api.service';
import { AnnotationService } from '../shared/annotation.service';
import { AuthService } from '../shared/auth.service';
import { SessionService } from '../shared/session.service';
import { SegmentorService } from '../shared/segmentor.service';

import { Paths } from '../shared/paths';

import { environment } from '../../../environments/environment';

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

  public doc_id = '';
  public  errorRaised = false;

  @ViewChild(AlveoTranscriber) annotator: AlveoTranscriber;

  constructor(
    private segmentorService: SegmentorService,
    private annotationService: AnnotationService,
    private apiService: ApiService,
    private sessionService: SessionService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
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
      this.item = await this.prepareItem(this.collection_id + '/' + this.item_id)

      this.loader_text = 'Loading audio data ...';
      this.audioFileData = await this.prepareAudioFile(this.collection_id + '/' + this.item_id, this.doc_id);

      this.loader_text = 'Checking annotations ...';
      try {
        let data = await this.loadAnnotations(this.getIdentifier());
        this.annotations = data['annotations'];
        this.ready = true;
      } catch(error) {
        this.ready = true;
      }
    } catch(error) {
      this.requestErrorHandler(error.message, error)
    }
  }

  public requestErrorHandler(message: string, error: any) {
    if (error.statusCode === 401) {
      this.authService.promptLogin();
      this.raiseError('Not authenticated');
    } else if (error.statusCode === 403) {
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
    return this.apiService.getItem(item_id);
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
    return this.apiService.getAudioFile(item_id, doc_id);
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
    return this.annotationService.loadAnnotations(identifier);
  }

  public saveAnnotations(ev: any): Promise<any> {
    return this.annotationService.saveAnnotations(this.getIdentifier(), ev['annotations']);
  }

  private async autoSegment(ev: any) {
    if (!this.authService.isLoggedIn()) {
      this.authService.promptLogin()
    } else {
      this.runSegmenter()
    }
  }

  private async runSegmenter() {
    this.isSegmenting = true;
  
    try {
      let data = await this.segmentorService.segment(this.getAudioFileUrl());
      let annotations = await this.annotator.rebuild(data.results);
      this.annotations = annotations;
      this.annotationService.saveAnnotations(this.getIdentifier(), annotations);
    } catch(error) {
      this.sessionService.displayError(error.message, error);
      this.isSegmenting = false;
    }
    this.isSegmenting = false;
  }
}
