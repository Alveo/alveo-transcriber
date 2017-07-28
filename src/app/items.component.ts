import { Component, EventEmitter, Input, Output } from '@angular/core';

import { AppUtilService } from './app-util.service';

@Component({
  selector: 'items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css'],
})

export class ItemsComponent {
  @Input() items: any;
  @Input() selected_item: any;
  @Output() onSelection = new EventEmitter<any>();

  constructor(public appService: AppUtilService) { }

  onSelect(item): void {
    this.selected_item = item;
    this.onSelection.emit(item);
  }
}
