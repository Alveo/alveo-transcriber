import { Component, OnInit, } from '@angular/core';

import { Router } from '@angular/router';

import { AuthService } from '../shared/auth.service';
import { AlveoService } from '../shared/alveo.service';

@Component({
  selector: 'itemlists',
  templateUrl: './itemlists.component.html',
  styleUrls: ['./itemlists.component.css'],
})

export class ItemListsComponent implements OnInit {
  private loading: boolean = true;
  private devMode: boolean = true;

  constructor(
    public router: Router,
    public authService: AuthService,
    public alveoService: AlveoService) {
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

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  isDevMode(): boolean {
    return this.devMode;;
  }

  setLoadingTimeout(interval: number): void {
    setTimeout(()=>this.loading=false, interval);
  }

  listSize(): number {
    if (this.alveoService.getLists() != undefined) {
      return this.alveoService.getLists().length;
    }
    return 0;
  }

  getLists(): any {
    return this.alveoService.getLists();
  }

  getData(): void {
    this.alveoService.getListDirectory();
  }

  onSelect(list): void {
    this.alveoService.getItems(list, (data) => {
      if (data == 403 && !this.isLoggedIn()) {
        this.authService.initiateLogin();
      }
      this.alveoService.selectedList = list;
      this.router.navigate(['./listview']);
    });
  }
}
