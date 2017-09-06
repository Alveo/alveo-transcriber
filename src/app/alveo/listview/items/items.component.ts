import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css'],
})

export class ItemsComponent {
  @Input() items: any;
  @Input() selected_item: any;
  @Output() onSelection = new EventEmitter<any>();

  onSelect(item): void {
    this.selected_item = item;
    this.onSelection.emit(item);
  }

  getData(): any {
    return this.items;
  }
}
