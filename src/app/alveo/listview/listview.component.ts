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

  selectedDoc: any;
  selectedItem: any;

  loadingData: boolean;

  activeItem: any;

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
    
    return this.alveoService.getItems(list);
  }

  getDocs(): any {
    if (this.activeItem == null) {
      return null;
    }

    let items = [];
    for (let item of this.alveoService.getDocs(this.activeItem)) {
      if (item['type'] == 'audio') {
        items.push(item);
      }
    }
    return items;
  }

  isDownloading(): boolean {
    return this.loadingData;
  }

  actionBack(): void {
    this.router.navigate(['./itemlists']);
  }

  onItemSelection(item: any): void {
    this.selectedItem = item;

    // TODO loadingData promise
    this.loadingData = true;

    this.alveoService.getDocs(item, (data) => {
      /* Set active only if still selected */
      if (this.selectedItem == item) {
        this.activeItem = item;
      }
      this.loadingData = false;
    })
  }

  onDocSelection(doc: any): void {
    this.selectedDoc = doc;

    this.alveoService.getAudioFile(doc, (data) => {
      /* Route only if it is still selected */
      if (this.selectedDoc == doc) {
        this.router.navigate(['./annotator']);
      }
    });
  }
}
