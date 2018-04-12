import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

/* Displays Alveo documents in the form of an audiosource */
@Component({
  selector: 'source-select',
  templateUrl: './source-select.component.html',
  styleUrls: ['./source-select.component.css'],
})
export class SourceSelectComponent implements OnInit {
  @Input() sources: Array<any> = [];
  @Output() onSelectedSourceChange: any = new EventEmitter<any>();
  
  private selectedSource: null;

  constructor() { }

  ngOnInit() {
    // TODO Filter sources down to audio only
    
    if (this.sources.length > 0) {
      this.selectedSource = this.sources[0];
    }
  }

  public sourceSelect($event, source): void {
    if ($event['isUserInput'] === true) {
      this.selectedSource = source;
      this.onSelectedSourceChange.emit(source)
    }
  }
}
