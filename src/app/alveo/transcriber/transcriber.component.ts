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

@Component({
  selector: 'transcriber',
  templateUrl: './transcriber.component.html',
  styleUrls: ['./transcriber.component.css']
})
export class TranscriberComponent implements OnInit {
  private ready: boolean = false;

  private item: any = null;
  private audioFileData: ArrayBuffer = null;
  private annotations: Array<Annotation> = [];
  private selectedAnnotation: Annotation = null;
  private defaultView: string = "list";

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
        const item_id = params['id'];
        if (item_id === undefined) {
          this.sessionService.navigate([Paths.ListIndex]);
        } else {
          this.prepareItem(item_id).then(
            (item) => {
              this.item = item;
              this.prepareAudioFile(item_id, item['alveo:documents'][0]['dcterms:identifier']).then(
                (data) => {
                  this.audioFileData = data;

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
              ).catch((error) => console.log(error));
            }
          ).catch((error) => console.log(error));
        }
      }
    );
  }

  public isReady(): boolean {
    return this.ready;
  }

  private prepareItem(list_id: string): Promise<any> {
    return new Promise(
      (resolve, reject) => {
        this.alveoService.getItem(list_id).subscribe(
          list => {
            resolve(list);
          },
          error => {
            if (error === 403 && !this.authService.isLoggedIn()) {
              this.authService.promptLogin();
            }
            reject(error);
          }
        );
      }
    );
  }

  public getAudioFileUrl(): string {
    if (this.item === null) {
      return "";
    }
    return this.item['alveo:documents'][0]['alveo:url'];
  }

  public getIdentifier(): string {
    if (this.item === null) {
      return null;
    }
    return this.item['alveo:metadata']['dc:title'];
  }
  
  private prepareAudioFile(list_id: string, doc_id: string): Promise<any> {
    return new Promise(
      (resolve, reject) => {
        this.alveoService.getAudioFile(list_id, doc_id).subscribe(
          audioData => {
            resolve(audioData);
          },
          error => {
            if (error === 403 && !this.authService.isLoggedIn()) {
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

  public exit(ev: any) {
    if (this.item === null) {
      this.sessionService.navigate([Paths.ListIndex]);
    } else {
      this.sessionService.navigate([Paths.ListView+'/'+this.getIdentifier()]);
    }
  }

  public loadAnnotations(identifier: string): Promise<any> {
    return this.annotationService.loadAnnotations(identifier);
  }

  public saveAnnotations(ev: any): Promise<any> {
    return this.annotationService.saveAnnotations(this.getIdentifier(), ev['annotations']);
  }

  private autoSegment(ev: any): void {
    this.segmentorService.segment(this.getAudioFileUrl(),
      (data) => {
        this.annotator.rebuild(data).then(
          (annotations) => {
            this.annotations = annotations;
            this.annotationService.saveAnnotations(this.getIdentifier(), annotations);
          }
        ).catch((error) => console.log(error));
      }
    );
  }
}
