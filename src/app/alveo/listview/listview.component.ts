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
    for (let item of this.alveoService.getListItemData(this.selected)) {
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
    /* Query the Alveo Service for the data */
    this.alveoService.getListItemData(item, (data) => {
      /*  Create a callback to switch to the new doc ONLY IF it is still selected */
      // if (this.selected == selectedCache) { }
      this.selected = item;
    })
  }

  onDocSelection(item: any): void {
    this.alveoService.getAudioFile(item['alveo:url'], (data) => {
      this.router.navigate(['./annotator']);
      /* Only if it is still selected */
    });
  }
}
