import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';

import { SessionService } from '../../shared/session.service';

import { AlveoService } from '../../shared/alveo.service';
import { AuthService } from '../../shared/auth.service';

import { Paths } from '../../shared/paths';

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
    private alveoService: AlveoService,
    private authService: AuthService,
    private sessionService: SessionService,
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
  private retrieveItemData(item: any): void {
    item['state'] = ItemState.DOWNLOADING;

    this.alveoService.getItem(item['id']).subscribe(
      data => {
        item['state'] = ItemState.READY;
        item['data'] = data;
      },
      error => {
        item['state'] = ItemState.FAILED;
        if (error.status === 401) {
          this.authService.promptLogin()
        } else if (error.status === 403) {
          this.sessionService.displayError('Licence for "'+item['id']+'" has not been accepted, please accept licence for this collection at https://app.alveo.edu.au/', error);
        } else {
          this.sessionService.displayError(error.message, error);
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

  public isDataReady(item: any): boolean {
    if (this.getItemState(item) === ItemState.READY
      && item['data'] !== null) {
      return true;
    }
    return false;
  }

  public onItemSelection(item: any): void {
    if (this.getItemState(item) === ItemState.NOT_CACHED
      && item['data'] === null) {
      this.retrieveItemData(item);
    }
  }

  public redirectTranscriber(doc: any, item: any): any {
    this.onSelect.emit({
      "item": {
        "id": item['data']['alveo:metadata']['dcterms:identifier'],
        "collection": item['data']['alveo:metadata']['dcterms:isPartOf'],
      },
      "doc": {
        "id": doc['dcterms:identifier']
      }
    });
  }
}
