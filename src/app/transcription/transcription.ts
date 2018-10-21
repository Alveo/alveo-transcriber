import { Annotation } from '../../../projects/alveo-transcriber/src/lib/shared/annotation';

const STORAGE_VERSION = "att_1.0";

export class Transcription {
  public remoteId: string= null;
  public remoteVersion: number= null;
  public storageSpecification: string= STORAGE_VERSION;
  public isPendingUpload: boolean= false;
  public annotations: Array<Annotation>= [];
  public lastEdit: number; // Technically functions as Date

  constructor(remoteId: string= "",
              annotations: Array<Annotation>= null,
              lastEdit: number= null,
              remoteVersion: number= null
             ) {
    this.remoteId = remoteId;
    this.annotations = annotations;
    this.storageSpecification = "att_1.0";
    this.isPendingUpload = false;
    this.remoteVersion = remoteVersion;

    this.lastEdit = lastEdit;
    if (this.lastEdit === null) {
      this.lastEdit = Date.now();
    }
  }
}
