import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AlveoTranscriber, Annotation } from '@alveo-vl/angular-transcriber';

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

  ngOnInit(): void {
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
          this.loader_text = 'Loading item ...';
          this.prepareItem(this.collection_id + '/' + this.item_id).then(
            (item) => {
              this.loader_text = 'Loading audio data ...';
              this.item = item;
              this.prepareAudioFile(this.collection_id + '/' + this.item_id, this.doc_id).then(
                (data) => {
                  this.audioFileData = data;
                  this.loader_text = 'Checking annotations ...';

                  this.loadAnnotations(this.getIdentifier()).then(
                    (annotations) => {
                      this.annotations = annotations;
                      this.ready = true;
                    }
                  ).catch(
                    () => {
                      this.annotations = [];
                      this.ready = true;
                    }
                  );
                }
              ).catch(
                (error) => this.requestErrorHandler(error.message, error)
              );
            }
          ).catch(
            (error) => this.requestErrorHandler(error.message, error)
          );
        }
      }
    );
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
    return new Promise(
      (resolve, reject) => {
        this.apiService.getItem(item_id).subscribe(
          list => resolve(list),
          error => reject(error)
        );
      }
    );
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
    return new Promise(
      (resolve, reject) => {
        this.apiService.getAudioFile(item_id, doc_id).subscribe(
          audioData => resolve(audioData),
          error => reject(error)
        );
      }
    );
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

  private autoSegment(ev: any): void {
    this.isSegmenting = true;

    this.segmentorService.segment(this.getAudioFileUrl()).subscribe(
      (data) => {
        this.isSegmenting = false;
        this.annotator.rebuild(data).then(
          (annotations) => {
            this.annotations = annotations;
            this.annotationService.saveAnnotations(this.getIdentifier(), annotations);
          })
          .catch((error) => {
            this.sessionService.displayError(error.message, error);
          });
      },
      (error) => {
        this.isSegmenting = false;
        this.sessionService.displayError(error.message, error);
      }
    );
  }
}
