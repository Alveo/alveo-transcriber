import { Component, OnInit, } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AuthComponent } from '../auth/auth.component';

import { Router } from '@angular/router';

import { AuthService } from '../shared/auth.service';
import { AlveoService } from '../shared/alveo.service';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'itemlists',
  templateUrl: './itemlists.component.html',
  styleUrls: ['./itemlists.component.css'],
})

export class ItemListsComponent implements OnInit {
  private loading: boolean = true;

  constructor(
    public router: Router,
    public authService: AuthService,
    public alveoService: AlveoService,
    public dialog: MatDialog
  ) { }

  isDevMode(): boolean {
    return !environment.production;
  }

  ngOnInit(): void {
    if (this.isLoggedIn()) {
      this.loading = false;
    } else {
      setTimeout(()=>{
        if (this.listSize() == 0) {
          console.log(this.listSize())
          this.dialog.open(AuthComponent, {
            disableClose: true,
            data: {firstRun: true}}
          );
        }
      }, 1000);
      setTimeout(()=>this.loading=false, 1000); // Allow DB time to load
    }
  }

  isLoading(): boolean {
    return this.loading;
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
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

  onSelection(list): void {
    this.alveoService.getItems(list, (data) => {
      if (data == 403 && !this.isLoggedIn()) {
        this.dialog.open(AuthComponent, {
          disableClose: false,
          data: {firstRun: false}}
        );
      } else {
        this.alveoService.selectedList = list;
        this.router.navigate(['./listview']);
      }
    });
  }
}
