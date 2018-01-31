import { Component, Input, Output, EventEmitter } from '@angular/core';

/* Display component for showing and selecting of docs
 *   Provides route for Annotator module */
@Component({
  selector: 'docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.css'],
})
export class DocsComponent {
  @Input() alveo_doc: any;
  @Output() onNavigate = new EventEmitter<any>();

  constructor() { }

  public getDocName(): string {
    return this.alveo_doc['dcterms:identifier'];
  }

  public navigate(): void {
    this.onNavigate.emit({});
  }
}
