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

  getDocs(item: any): any {
    if (item == null) {
      return null;
    }

    let docs = [];
    for (let doc of this.alveoService.getDocs(item)) {
      if (doc['type'] == 'audio') {
        docs.push(doc);
      }
    }
    return docs;
  }

  shorten(url: string): string {
    return url.split("/catalog/")[1];
  }

  actionBack(): void {
    this.router.navigate(['./itemlists']);
  }

  getItemStatus(item: any): string {
    return this.alveoService.getItemStatus(item);
  }
  onItemSelection(item: any): void {
    this.alveoService.getDocs(item)
  }

  onDocSelection(doc: any): void {
    this.selectedDoc = doc;

    this.alveoService.getAudioFile(doc, (data) => {
      if (this.selectedDoc == doc) {
        this.router.navigate(['./annotator']);
      }
    });
  }
}
