import { Annotation } from 'alveo-transcriber';

const STORAGE_VERSION = "att_1.0";

export class Transcription {
  public remoteId: string= null;
  public storageSpecification: string= STORAGE_VERSION;
  public isPendingUpload: boolean= false;
  public annotations: Array<Annotation>= [];

  constructor(remoteId: string= "",
              annotations: Array<Annotation>,
             ) {
    this.remoteId = remoteId;
    this.annotations = annotations;
    this.storageSpecification = "att_1.0";
    this.isPendingUpload = false;
  }
}

