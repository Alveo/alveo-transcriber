import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AppUtilService } from './app-util.service';

@Component({
  selector: 'itemlists',
  templateUrl: './itemlists.component.html',
  styleUrls: ['./itemlists.component.css'],
})

export class ItemListsComponent implements OnInit {
  private loading: boolean = true;

  constructor(
    public router: Router,
    public appService: AppUtilService) {
  }

  ngOnInit(): void {
    if (this.isLoggedIn()) {
      this.loading = false;
    } else {
      this.setLoadingTimeout(1000); // Give the DB time to load, could later implement a check up the chain
    }
  }

  isLoading(): boolean {
    return this.loading;
  }

  setLoadingTimeout(interval: number): void {
    setTimeout(()=>this.loading=false, interval);
  }

  pullData(): void {
    if (!this.isLoggedIn())
      this.appService.auth.initiateLogin();

    this.appService.alveo.pullIndex();
  }

  reset(): void {
    this.appService.alveo.reset();
  }

  resetStore(): void {
    this.reset();
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
