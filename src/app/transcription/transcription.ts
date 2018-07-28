import { Annotation } from 'alveo-transcriber';

const STORAGE_VERSION = "att_1.0";

export class Transcription {
  remote_id: string;
  storage_spec: string;
  annotations: Array<Annotation>;

  constructor(remote_id: string= "",
              annotations: Array<Annotation>,
             ) {
    this.remote_id = remote_id
    this.annotations = annotations;
    this.storage_spec = "att_1.0";
  }
}

