import { Annotation } from 'alveo-transcriber';

const STORAGE_VERSION = "att_1.0";

export class Transcription {
  public remoteId: string= null;
  public storageSpecification: string= STORAGE_VERSION;
  public isPendingUpload: boolean= false;
  public annotations: Array<Annotation>= [];
  public last_edit: number; // Technically functions as Date

  constructor(remoteId: string= "",
              annotations: Array<Annotation>,
              last_edit: number= null
             ) {
    this.remoteId = remoteId;
    this.annotations = annotations;
    this.storageSpecification = "att_1.0";
    this.isPendingUpload = false;

    this.last_edit = last_edit;
    if (this.last_edit === null) {
      this.last_edit = Date.now();
    }
  }
}
