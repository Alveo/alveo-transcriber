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

  public asCSV(filename: string, annotations: Array<Annotation>): void {
    const parser = new json2csv({ANNOTATION_CSV_FIELDS});
    const csv = parser.parse(annotations);

    const url = this.generateDownload(csv, 'text/csv'); 
    this.downloadFile(url, filename);
  }

  public asJSON(filename: string, annotations: Array<Annotation>): void {
    const json = JSON.stringify({
      'doc_id': filename,
      'annotations': annotations,
    }, null, 2);

    const url = this.generateDownload(json, 'application/json'); 
    this.downloadFile(url, filename);
  }

  private getVTTtimestamp(time: number): string {
    let date = new Date(null); 
    date.setTime(time * 1000);
    return date.toISOString().substr(11, 12);
  }

  public asWebVTT(filename: string, annotations: Array<Annotation>): void {
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

    const url = this.generateDownload(vtt, 'application/text'); 
    this.downloadFile(url, filename);
  }

  private downloadFile(url, filename): void {
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

  private generateDownload(data: any, type: string): string {
    const blob = new Blob([data], { type: type });
    return window.URL.createObjectURL(blob);
  }
}
