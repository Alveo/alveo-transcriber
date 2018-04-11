import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

/* Display component for showing and selecting of docs
 *   Provides route for Annotator module */
@Component({
  selector: 'docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.css'],
})
export class DocsComponent implements OnInit {
  @Input() docs: Array<any> = [];
  @Output() onSelectedDocChange: any = new EventEmitter<any>();
  
  private selectedDoc: null;

  constructor() { }

  ngOnInit() {
    if (this.docs.length > 0) {
      this.selectedDoc = this.docs[0];
    }
  }

  public docSelect($event, doc): void {
    if ($event['isUserInput'] === true) {
      this.selectedDoc = doc;
      this.onSelectedDocChange.emit(doc)
    }
  }
}
