import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';

import { Paths } from '../../shared/paths';

import { AlveoService } from '../../shared/alveo.service';
import { AuthService } from '../../shared/auth.service';

enum ItemState {
  UNCHECKED = 'Unchecked',
  FAILED = 'Failed',
  NOT_CACHED = 'Not Cached',
  DOWNLOADING = 'Downloading',
  READY = 'Ready',
}

/* Display component for items
 *  Provides documents */
@Component({
  selector: 'items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css'],
})
export class ItemsComponent {
  @Input() itemUrls: Array<any> = [];
  @Output() onSelect = new EventEmitter<any>();
  private items: Array<any> = [];

  private itemDisplay: Array<any> = null
  private itemDisplaySize: number;

  public pageSize: number = 15;
  public pageIndex: number = 0;

  public filter: string = "";

  private ready: boolean = false;

  constructor(
    private authService: AuthService,
    private alveoService: AlveoService,
  ) { }

  ngOnInit() {
    this.generateItemList();
    this.scanItemList().then(
      () => {
        this.generateItemDisplay();
        this.ready = true;
      }
    );
  }

  public isReady(): boolean {
    return this.ready;
  }

  private generateItemList() {
    for (const item of this.itemUrls) {
      this.items.push({
        id: item.split('/catalog/')[1],
        url: item,
        state: ItemState.UNCHECKED,
        data: null
      });
    }
  }

  private filterDisplay(): void {
    this.itemDisplay = this.itemDisplay.filter(
      item => item.id.includes(this.filter)
    );
    this.itemDisplaySize = this.itemDisplay.length;

    this.pageIndex = 0;
  }

  private generateItemDisplay() {
    const start = this.pageIndex * this.pageSize;
    let end = start + this.pageSize;
    if (end > this.items.length) {
      end = this.items.length;
    }
    this.itemDisplay = this.items.slice(start, end);
    this.itemDisplaySize = this.getItemCount();

    if (this.filter != "") {
      this.filterDisplay();
    }
  }

  public paginatorEvent(ev: any) {
    this.pageSize = ev.pageSize;
    this.pageIndex = ev.pageIndex;

    this.generateItemDisplay();
  }

  public applyFilter(filter: any) {
    filter = filter.trim();
    filter = filter.toLowerCase(); // Data source is lower-case/numbers
    this.filter = filter;

    this.generateItemDisplay();
  }

  /* Checks whether the cache has the item already downloaded */
  private scanItemList(): Promise<any> {
    let items_loaded = 0;
    const item_count = this.items.length;

    return new Promise(
      (resolve, reject) => {
        for (const item of this.items) {
          this.alveoService.getItem(item['id'], true, false).subscribe(
            data => {
              item['state'] = ItemState.READY;
              item['data'] = data;
              items_loaded += 1;
            },
            error => {
              item['state'] = ItemState.NOT_CACHED;
              items_loaded += 1;
            }
          );
        }
        const interval = setInterval(() => {
          if (items_loaded === item_count) {
            clearInterval(interval);
            resolve();
          }
        }, 5);
      }
    );
  }

  private getItemDocuments(item: any): void {
    return item['data']['alveo:documents'];
  }

  private getItemPrimaryDocument(item: any): void {
    return item['data']['alveo:documents'][0];
  }

  private retrieveItemData(item: any): void {
    item['state'] = ItemState.DOWNLOADING;

    this.alveoService.getItem(item['id']).subscribe(
      data => {
        item['state'] = ItemState.READY;
        item['data'] = data;
      },
      error => {
        item['state'] = ItemState.FAILED;
        if (error === 403 || !this.authService.isLoggedIn()) {
          this.authService.promptLogin()
        }
      }
    );
  }

  public getItems(): any {
    return this.itemDisplay;
  }

  public getItemCount(): any {
    return this.items.length;
  }

  public getListDisplaySize() {
    return this.itemDisplaySize;
  }

  public getItemState(item: any): string {
    return item['state'];
  }

  public getItemName(item: any): string {
    return item['id'];
  }

  public getItemIdentifier(item: any): string {
    return item['data']['alveo:metadata']['alveo:handle'];
  }

  public getItemUrl(item: any): string {
    return item['url'];
  }

  public isDataReady(item: any): boolean {
    if (this.getItemState(item) === ItemState.READY
      && item['data'] !== null) {
      return true;
    }
    return false;
  }

  public onItemSelection(item: any): any {
    if (this.getItemState(item) === ItemState.NOT_CACHED
      && item['data'] === null) {
      this.retrieveItemData(item);
    }
    return item['data'];
  }

  public onDocumentSelection(ev: any, item: any): any {
    this.onSelect.emit({
      "item_id": this.getItemName(item),
      "doc_id": ev['doc_id'],
    });
  }
}
