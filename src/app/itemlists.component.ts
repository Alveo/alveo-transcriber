import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AppUtilService } from './app-util.service';

@Component({
  selector: 'itemlists',
  templateUrl: './itemlists.component.html',
  styleUrls: ['./itemlists.component.css'],
})

export class ItemListsComponent {
  constructor(
    public router: Router,
    public appService: AppUtilService) { }

  pullData(): void {
    this.appService.alveo.pullIndex();
  }

  reset(): void {
    this.appService.alveo.reset();
    this.resetStore();
  }

  resetStore(): void {
    this.appService.alveo.resetStore();
  }

  storeData(): void {
    this.appService.alveo.storeData();
  }

  listSize(): number {
    if (this.appService.alveo.getLists() != undefined) {
      return this.appService.alveo.getLists().length;
    }
    return 0;
  }

  getLists(): any {
    return this.appService.alveo.getLists();
  }

  onSelect(list): void {
    this.appService.alveo.selectedList = list;
    this.router.navigate(['./dataview']);
  }

  isLoggedIn(): boolean {
    return this.appService.auth.isLoggedIn();
  }
}
