import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';

import { SessionService } from '../../shared/session.service';

import { AlveoClientService } from '../../../alveo-client/alveo-client.service';
import { AuthService } from '../../shared/auth.service';

import { Paths } from '../../shared/paths';

import { environment } from '../../../../environments/environment';

enum ItemState {
  UNCHECKED = 'Unchecked',
  FAILED = 'Failed',
  NOT_AUTHENTICATED = 'Not Authenticated',
  NOT_LICENCED = 'Licence Not Accepted',
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
export class ItemsComponent implements OnInit {
  @Input() itemUrls: Array<any> = [];
  @Output() transcribeItem = new EventEmitter<any>();
  private items: Array<any> = [];

  private itemDisplay: Array<any> = null;
  private itemDisplaySize: number;

  public pageSize = 15;
  public pageIndex = 0;

  public filter = '';

  private ready = false;

  constructor(
    private alveoClientService: AlveoClientService,
    private authService: AuthService,
    private sessionService: SessionService,
  ) { }

  async ngOnInit() {
    this.generateItemList();
    await this.scanItemList();
    this.generateItemDisplay();
    this.ready = true;
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

    if (this.filter !== '') {
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
  private async scanItemList(): Promise<any> {
    for (const item of this.items) {
      try {
        const itemdata = await this.alveoClientService.getItem(item['id'], true, false);
        item['state'] = ItemState.READY;
        item['data'] = itemdata;
      } catch(error) {
        item['state'] = ItemState.NOT_CACHED;
      }
    }
  }

  private async retrieveItemData(item: any): Promise<any> {
    item['state'] = ItemState.DOWNLOADING;

    try {
      const itemdata = await this.alveoClientService.getItem(item['id']);
      item['state'] = ItemState.READY;
      item['data'] = itemdata;
    } catch(error) {
      if (error.statusCode === 401) {
        this.authService.promptLogin();
        item['state'] = ItemState.NOT_AUTHENTICATED;
      } else if (error.statusCode === 403) {
        item['state'] = ItemState.NOT_LICENCED;
        this.sessionService.displayError(
          'Licence for "'
          + item['id']
          + '" has not been accepted, please accept licence for this collection at '
          + environment.alveoPaths.mainUrl,
          error);
      } else {
        this.sessionService.displayError(error.message, error);
        item['state'] = ItemState.FAILED;
      }
    }
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
    if ([
         ItemState.NOT_CACHED,
         ItemState.NOT_AUTHENTICATED,
         ItemState.NOT_LICENCED
        ].includes(<ItemState> this.getItemState(item))
      && item['data'] === null) {
      this.retrieveItemData(item);
    }
  }

  public onTranscribe(doc: any, item: any): any {
    this.transcribeItem.emit({
      'item': {
        'id': item['data']['alveo:metadata']['dcterms:identifier'],
        'collection': item['data']['alveo:metadata']['dcterms:isPartOf'],
      },
      'doc': {
        'id': doc['dcterms:identifier']
      }
    });
  }
}
