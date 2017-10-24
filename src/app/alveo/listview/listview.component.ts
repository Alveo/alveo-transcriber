import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material';

import { AlveoService } from '../shared/alveo.service';
import { AuthService } from '../shared/auth.service';

import { AuthComponent } from '../auth/auth.component';

import { AnnotatorService } from '../../annotator/shared/annotator.service';

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
    public annotatorService: AnnotatorService,
    public router: Router,
    public dialog: MatDialog,
    public authService: AuthService,
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
    this.alveoService.getDocs(item, (data) => {
      if (data == 403 && !this.authService.isLoggedIn()) {
        this.requireLogin()
      }
    });
  }

  onDocSelection(doc: any): void {
    this.selectedDoc = doc;

    this.alveoService.getAudioFile(doc, (data) => {
      if (data == 403 && !this.authService.isLoggedIn()) {
        this.requireLogin();
      }
      else {
        if (this.selectedDoc == doc) {
          this.annotatorService.audioFile = data;
          this.annotatorService.annotations = [];
          this.annotatorService.audioFileName = doc['dcterms:identifier'];

          this.router.navigate(['./annotator']);
        }
      }
    });
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
