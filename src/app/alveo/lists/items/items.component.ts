import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material';

import { AlveoService } from '../../shared/alveo.service';
import { AuthService } from '../../shared/auth.service';

import { AuthComponent } from '../../auth/auth.component';

enum ItemState {
  UNCHECKED = "Unchecked",
  FAILED = "Failed",
  NOT_CACHED = "Not Cached",
  DOWNLOADING = "Downloading",
  READY = "Ready",
}

@Component({
  selector: 'items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css'],
})
export class ItemsComponent {
  @Input() itemUrls: Array<any> = [];
  items: Array<any> = [];

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthService,
    private alveoService: AlveoService) {
  }

  private ngOnInit() {
    this.generateItemList();
    this.scanItemList();
  }

  private generateItemList() {
    for (let item of this.itemUrls) {
      this.items.push({
        url: item,
        state: ItemState.UNCHECKED,
        data: null
      });
    }
  }

  private scanItemList() {
    for (let item of this.items) {
      this.alveoService.getItem(item['url'], true, false).subscribe(
        data => {
          item['state'] = ItemState.READY;
          item['data'] = data;
        },
        error => {
          item['state'] = ItemState.NOT_CACHED;
        }
      );
    }
  }

  public getItems(): any {
    return this.items;
  }
  
  public getItemCount(): any {
    return this.getItems().length;
  }

  public getItemState(item: any): string {
    return item['state'];
  }

  public getItemUrl(item: any): string {
    return item['url'].split('/catalog/')[1];
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

  private getItemDocuments(item: any): void {
    return item['data']['alveo:documents'];
  }

  private retrieveItemData(item: any): void {
    item['state'] = ItemState.DOWNLOADING;

    this.alveoService.getItem(item['url']).subscribe(
      data => {
        item['state'] = ItemState.READY;
        item['data'] = data;
      },
      error => {
        item['state'] = ItemState.FAILED;
        console.log(error);
        if (error === 403 || !this.authService.isLoggedIn()) {
          this.requireLogin()
        }
      }
    );
  }

  private requireLogin() {
    if (this.dialog.openDialogs.length < 1) {
      this.dialog.open(AuthComponent, {
        disableClose: false,
        data: {firstRun: false}}
      );
    }
  }
}
