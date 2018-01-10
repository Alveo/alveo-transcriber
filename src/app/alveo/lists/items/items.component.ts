import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material';

import { AlveoService } from '../../shared/alveo.service';
import { AuthService } from '../../shared/auth.service';

import { AuthComponent } from '../../auth/auth.component';

import { AnnotatorService } from '../../../annotator/shared/annotator.service';

@Component({
  selector: 'items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css'],
})

export class ItemsComponent {
  @Input() itemUrls: Array<any> = [];
  items: Array<any> = [];

  constructor(
    private annotatorService: AnnotatorService,
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthService,
    private alveoService: AlveoService) {
  }

  ngOnInit() {
    console.log(this.itemUrls);
    this.generateItemList();
  }

  generateItemList() {
    for (let item of this.itemUrls) {
      this.items.push({
        url: item,
        state: "Unchecked"
      });
    }
  }

  getItemCount(): any {
    return this.items.length;
  }

  getItems(): any {
    return this.items;
  }

  shorten(url: string): string {
    return url.split('/catalog/')[1];
  }

  getItemState(item: any): string {
    return item['state'];
  }

  onItemSelection(item: any): void {
    /*
    this.alveoService.getDocs(item, (data) => {
      if (data === 403 && !this.authService.isLoggedIn()) {
        this.requireLogin()
      }
    });
     */
  }

  getItem(url: string): any {
    if (url === "") {
      // TODO throw exc
      return;
    }

    let items = this.alveoService.getItem(url).subscribe(
      data => {
        this.items.push({
          name: url,
          url: url,
          data: data
        });
        console.log("Received data for "+url);
      },
      error => {
        console.log(error);
      }
    );
  }

  requireLogin() {
    if (this.dialog.openDialogs.length < 1) {
      this.dialog.open(AuthComponent, {
        disableClose: false,
        data: {firstRun: false}}
      );
    }
  }
}
