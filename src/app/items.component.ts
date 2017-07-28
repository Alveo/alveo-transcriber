import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { AppUtilService } from './app-util.service';

@Component({
  selector: 'items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css'],
})

export class ItemsComponent {
  @Input() items: any;
  @Input() selection: any;

  constructor(
    public router: Router,
    public appService: AppUtilService) { }

  onSelect(item): void {
    this.selection = item;
  }
}
