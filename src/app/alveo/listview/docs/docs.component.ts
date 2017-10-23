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
  @Output() onSelection = new EventEmitter<any>();

  getDocs(): any {
    return this.docs;
  }

  isDownloadingData(): boolean {
    return this.isLoadingData;
  }

  onSelect(item): void {
    this.selection = item;
    this.onSelection.emit(item);
  }

  shorten(url): string {
    return url.split("/document/")[1];
  }
}
