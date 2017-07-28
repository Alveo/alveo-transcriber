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

  private getList(): any {
    return this.appService.alveo.getActiveList();
  }

  private getData(): any {
    return this.appService.alveo.getActiveListData(); // If it doesn't exist, it will be pulled
  }

  getListName(): any {
    let list = this.getList();
    if (list == null) {
      return "(Loading)"
    }
    return list.name;
  }

  getListSize(): any {
    let list = this.getList();
    if (list == null) {
      return "(...)"
    }
    return list.num_items;
  }

  getItems(): any {
    let list = this.getList();
    if (list == null) {
      return []
    }
    
    let items = [];
    for (let item of this.getData()) {
      items.push(item);
    }
    return items;
  }

  onSelect(list): void {
    //this.appSerice.alveo.pullList(list.item_list_url);
    //this.router.navigate(['./itemlist']);
  }

  actionBack(): void {
    this.router.navigate(['./itemlists']);
  }
}
