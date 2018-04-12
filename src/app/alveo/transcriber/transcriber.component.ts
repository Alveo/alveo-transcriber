import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { AlveoService } from '../shared/alveo.service';
import { AnnotationService } from '../shared/annotation.service';
import { AuthService } from '../shared/auth.service';
import { SessionService } from '../shared/session.service';
import { SegmentorService } from '../shared/segmentor.service';

import { AnnotatorComponent } from '../../annotator/annotator.component'
import { Annotation } from '../../annotator/shared/annotation';
import { Paths } from '../shared/paths';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'transcriber',
  templateUrl: './transcriber.component.html',
  styleUrls: ['./transcriber.component.css']
})
export class TranscriberComponent implements OnInit {
  private ready: boolean = false;
  private loader_text: string = "";
  private list_id: string = "";

  private item: any = null;
  private audioFileData: ArrayBuffer = null;
  private annotations: Array<Annotation> = [];
  private selectedAnnotation: Annotation = null;
  private defaultView: string = "list";
  private errorRaised: boolean = false;

  private isSegmenting: boolean = false;

  private item_id: string = '';
  private collection_id: string = '';
  public doc_id: string = '';

  @ViewChild(AnnotatorComponent) annotator: AnnotatorComponent;

  constructor(
    private segmentorService: SegmentorService,
    private annotationService: AnnotationService,
    private alveoService: AlveoService,
    private sessionService: SessionService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(
      (params: Params) => {
        this.loader_text = "Loading ...";
        this.list_id = params['list_id'];
        this.collection_id = params['collection_id'];
        this.item_id = params['item_id'];
        this.doc_id = params['doc_id'];
        if (this.item_id === undefined) {
          this.sessionService.navigate([Paths.ListIndex]);
        } else {
          this.loader_text = "Loading item ...";
          this.prepareItem(this.collection_id+"/"+this.item_id).then(
            (item) => {
              this.loader_text = "Loading audio data ...";
              this.item = item;
              this.prepareAudioFile(this.collection_id+"/"+this.item_id, this.doc_id).then(
                (data) => {
                  this.audioFileData = data;
                  this.loader_text = "Checking annotations ...";

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
                (error) => {
                  this.raiseError();
                  this.sessionService.displayError(error.message, error);
                }
              );
            }
          ).catch(
            (error) => {
              this.raiseError();
              this.sessionService.displayError(error.message, error);
            }
          );
        }
      }
    );
  }

  public getLoadingText(): string {
    return this.loader_text;
  }

  public isReady(): boolean {
    return this.ready;
  }

  public raiseError(): void {
    this.errorRaised = true;
    this.loader_text = "An error has occurred.";
  }

  private prepareItem(list_id: string): Promise<any> {
    return new Promise(
      (resolve, reject) => {
        this.alveoService.getItem(list_id).subscribe(
          list => {
            resolve(list);
          },
          error => {
            if (error.status === 401) {
              this.authService.promptLogin();
            }
            reject(error);
          }
        );
      }
    );
  }

  public getAudioFileUrl(): string {
    let path = environment.alveoPaths.mainUrl
      + '/' + environment.alveoPaths.itemSuffix
      + '/' + this.collection_id
      + '/' + this.item_id
      + '/document/' + this.doc_id
    return path
  }

  public getIdentifier(): string {
    if (this.item === null) {
      return null;
    }
    return this.item['alveo:metadata']['alveo:handle'];
  }
  
  private prepareAudioFile(list_id: string, doc_id: string): Promise<any> {
    return new Promise(
      (resolve, reject) => {
        this.alveoService.getAudioFile(list_id, doc_id).subscribe(
          audioData => {
            resolve(audioData);
          },
          error => {
            if (error.code === 401 && !this.authService.isLoggedIn()) {
              this.authService.promptLogin();
            }
            reject(error);
          }
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
    if (this.list_id != "") {
      this.sessionService.navigate([Paths.ListView+'/'+this.list_id]);
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
          })
      },
      (error) => {
        this.isSegmenting = false;
        this.sessionService.displayError(error.message, error);
      }
    )
  }
}
