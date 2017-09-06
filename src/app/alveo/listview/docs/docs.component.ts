import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.css'],
})

export class DocsComponent {
  @Input() docs: any;
  @Input() selection: any;
  @Output() onSelection = new EventEmitter<any>();

  getDocs(): any {
    return this.docs;
  }

  onSelect(item): void {
    this.selection = item;
    this.onSelection.emit(item);
  }
}
