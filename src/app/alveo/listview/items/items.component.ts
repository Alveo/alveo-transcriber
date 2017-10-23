import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css'],
})

export class ItemsComponent {
  @Input() items: any;
  @Input() selection: any;
  @Output() onSelection = new EventEmitter<any>();

  getData(): any {
    return this.items;
  }

  onSelect(item): void {
    this.selection = item;
    this.onSelection.emit(item);
  }

  shorten(url: string): string {
    return url.split("/catalog/")[1];
  }
}
