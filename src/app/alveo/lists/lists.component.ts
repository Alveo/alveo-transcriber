import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material';

import { AlveoService } from '../shared/alveo.service';
import { AuthService } from '../shared/auth.service';

import { AuthComponent } from '../auth/auth.component';

import { AnnotatorService } from '../../annotator/shared/annotator.service';

@Component({
  selector: 'lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css'],
})

export class ListsComponent {
  @Input() items: any;

  selectedDoc: any;

  activeItem: any;

  constructor(
    private annotatorService: AnnotatorService,
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthService,
    private alveoService: AlveoService) { }

  private getList(): any {
    return this.alveoService.tmp_list;
  }

  getListName(): any {
    const list = this.getList();
    if (list === null) {
      return 'null'
    }
    return list.name;
  }

  getListSize(): any {
    const list = this.getList();
    if (list === null) {
      return 'null'
    }
    return list.num_items;
  }

  getItems(): any {
    const list = this.getList();
    if (list === null) {
      return null;
    }

    return this.alveoService.tmp_list['items'];
  }

  getDocs(item: any): any {
    if (item === null) {
      return null;
    }

    const docs = [];
    /*
    for (const doc of this.alveoService.getDocs(item)) {
      if (doc['type'] === 'audio') {
        docs.push(doc);
      }
    }
     */
    return docs;
  }

  shorten(url: string): string {
    return url.split('/catalog/')[1];
  }

  actionBack(): void {
    this.router.navigate(['./itemlists']);
  }

  getItemStatus(item: any): string {
    return ""; //this.alveoService.getItemStatus(item);
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

  onDocSelection(doc: any, item: any): void {
    this.selectedDoc = doc;

    /*
    this.alveoService.getAudioFile(doc, (data) => {
      if (data === 403 && !this.authService.isLoggedIn()) {
        this.requireLogin();
      } else {
          if (this.selectedDoc === doc) {
            this.annotatorService.audioFile = data;
            this.annotatorService.rebase(this.alveoService.getAnnotations(item));
            this.annotatorService.audioFileName = doc['dcterms:identifier'];
            this.annotatorService.audioFileURL = doc['alveo:url'];

            this.alveoService.watchAnnotations(item, this.annotatorService.annotationsUpdate);
            this.router.navigate(['./annotator']);
          }
        }
    });
     */
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
