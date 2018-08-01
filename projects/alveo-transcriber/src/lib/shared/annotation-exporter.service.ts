import { Injectable } from '@angular/core';

import { Annotation, ANNOTATION_CSV_FIELDS } from './annotation';

// Fix for module building
import * as json2csv_ from 'json2csv';
const json2csv = json2csv_.Parser;

@Injectable({
  providedIn: 'root'
})

export class AnnotationExporterService {
  constructor() { }

  public asCSV(annotations: Array<Annotation>): string {
    const parser = new json2csv({ANNOTATION_CSV_FIELDS});
    return parser.parse(annotations);
  }

  public asCSVAttachment(filename: string, annotations: Array<Annotation>): void {
    this.downloadAttachment(this.asCSV(annotations), 'text/csv', filename);
  }

  public asJSON(annotations: Array<Annotation>): string {
    return JSON.stringify(annotations, null, 2);
  }

  public asJSONAttachment(filename: string, annotations: Array<Annotation>): void {
    this.downloadAttachment(this.asJSON(annotations), 'application/json', filename);
  }

  private getVTTtimestamp(time: number): string {
    let date = new Date(null); 
    date.setTime(time * 1000);
    return date.toISOString().substr(11, 12);
  }

  public asWebVTT(annotations: Array<Annotation>): string {
    let vtt = "WEBVTT\n\n";
    let index = 1;
    for (let annotation of annotations) {
      vtt += index + "\n";
      vtt += this.getVTTtimestamp(annotation['start']);
      vtt += " --> "
      vtt += this.getVTTtimestamp(annotation['end']);

      let author = "";
      if (annotation.speaker != "") {
        author = "<v "+annotation.speaker+">";
      }
      vtt += "\n" + author + annotation.caption + "\n\n"

      index = index + 1;
    }
    return vtt;
  }

  public asWebVTTAttachment(filename: string, annotations: Array<Annotation>): void {
    this.downloadAttachment(this.asWebVTT(annotations), 'application/text', filename);
  }

  public downloadAttachment(data: string, dataType: any, filename: string): void {
    const blob = new Blob([data], { type: dataType });
    const url = window.URL.createObjectURL(blob);

    // Create named DL
    const anchor = document.createElement('a');
    anchor.download = filename;
    anchor.href = url;

    // Begin download
    window.document.body.appendChild(anchor);
    anchor.click();

    // Cleanup
    window.document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }
}
