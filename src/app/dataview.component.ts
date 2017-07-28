import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { AppUtilService } from './app-util.service';

@Component({
  selector: 'dataview',
  templateUrl: './dataview.component.html',
  styleUrls: ['./dataview.component.css'],
})

export class DataViewComponent {
  @Input() items: any;

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

  actionBack(): void {
    this.router.navigate(['./itemlists']);
  }
}
