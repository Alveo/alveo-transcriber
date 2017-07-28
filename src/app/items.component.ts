import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AppUtilService } from './app-util.service';

@Component({
  selector: 'items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css'],
})

export class ItemsComponent {
  constructor(
    public router: Router,
    public appService: AppUtilService) { }

  getListName(): any {
    if (this.appService.alveo.storage.items == null) {
      return "(Loading)"
    }
    return this.appService.alveo.storage.items.name;
  }

  getListSize(): any {
    if (this.appService.alveo.storage.items == null) {
      return "(...)"
    }
    return this.appService.alveo.storage.items.num_items;
  }

  getItems(): any {
    if (this.appService.alveo.storage.items == null) {
      return []
    }
    return this.appService.alveo.storage.items.items;
  }

  onSelect(list): void {
    //this.appSerice.alveo.pullList(list.item_list_url);
    //this.router.navigate(['./itemlist']);
  }

  actionBack(): void {
    this.router.navigate(['./itemlists']);
  }
}
