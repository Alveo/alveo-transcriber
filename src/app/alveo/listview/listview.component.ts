import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { AlveoService } from '../shared/alveo.service';

@Component({
  selector: 'listview',
  templateUrl: './listview.component.html',
  styleUrls: ['./listview.component.css'],
})

export class ListViewComponent {
  @Input() items: any;
  selected: any;

  constructor(
    public router: Router,
    public alveoService: AlveoService) { }

  private getList(): any {
    return this.alveoService.getActiveList();
  }

  private getData(): any {
  }

  private getDocsData(): any {
    return this.alveoService.getListItemData(this.selected).data['alveo:documents'];
  }

  getListName(): any {
    let list = this.getList();
    if (list == null) {
      return "null"
    }
    return list.name;
  }

  getListSize(): any {
    let list = this.getList();
    if (list == null) {
      return "null"
    }
    return list.num_items;
  }

  getItems(): any {
    let list = this.getList();
    if (list == null) {
      return null;
    }
    
    return this.alveoService.getListData(list);
  }

  getDocs(): any {
    if (this.selected == null) {
      return null;
    }

    let items = [];
    for (let item of this.getDocsData()) {
      if (item['type'] == 'audio') {
        items.push(item);
      }
    }
    return items;
  }

  actionBack(): void {
    this.router.navigate(['./itemlists']);
  }

  onItemSelection(item: any): void {
    this.selected = item;
    /* Query the Alveo Service for the data
     *  Create a callback to switch to the new doc ONLY IF it is still selected
     * */
  }

  onDocSelection(item: any): void {
  }
}
