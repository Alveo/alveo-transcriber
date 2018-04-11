import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'item-loader',
  templateUrl: './item-loader.component.html',
  styleUrls: ['./item-loader.component.css'],
})
export class ItemLoaderComponent {
  @Input() identifier: string = "";
  @Input() state: string = "";

  constructor() { }
}
