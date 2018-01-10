import { Component, Input } from '@angular/core';

@Component({
  selector: 'docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.css'],
})

export class DocsComponent {
  @Input() docs: any;

  public getDocs(): any {
    return this.docs;
  }

  public shortenUrl(url): string {
    return url.split('/document/')[1];
  }

  public onSelect(doc: any): void {
    //onDocSelection(doc)
  }

  /*
  onDocSelection(doc: any, item: any): void {
    this.selectedDoc = doc;

    this.alveoService.getAudioFile(doc, (data) => {
      if (data === 403 && !this.authService.isLoggedIn()) {
        this.requireLogin();
      } else {
          if (this.selectedDoc === doc) {
            this.annotatorService.audioFile = data;
            this.annotatorService.rebase(this.alveoService.getAnnotations(item));
            this.annotatorService.audioFileName = doc['dcterms:identifier'];
            this.annotatorService.audioFileURL = doc['alveo:url'];

            this.alveoService.watchAnnotations(item, this.annotatorService.annotationsUpdate);
            this.router.navigate(['./annotator']);
          }
        }
    });
  }
 */
}
