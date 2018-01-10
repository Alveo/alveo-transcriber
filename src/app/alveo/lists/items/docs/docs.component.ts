import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.css'],
})

export class DocsComponent {
  @Input() docs: any;
  @Input() selection: any;
  @Input() isLoadingData: boolean;

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

  getDocs(): any {
    return this.docs;
  }

  isDownloadingData(): boolean {
    return this.isLoadingData;
  }

  onSelect(item): void {
    this.selection = item;
    //this.onSelection.emit(item);
  }

  shorten(url): string {
    return url.split('/document/')[1];
  }
}
