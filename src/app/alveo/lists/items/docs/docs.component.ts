import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material';

import { AlveoService } from '../../../shared/alveo.service';
import { AuthService } from '../../../shared/auth.service';

import { AuthComponent } from '../../../auth/auth.component';

@Component({
  selector: 'docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.css'],
})

export class DocsComponent {
  @Input() docs: any;
  selectedDoc: any = null;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthService,
    private alveoService: AlveoService) {
  }

  public getDocs(): any {
    return this.docs;
  }

  public shortenUrl(url): string {
    return url.split('/document/')[1];
  }

  public onSelect(doc: any): void {
    this.selectedDoc = doc;
    this.downloadDoc(doc)
  }

  private requireLogin() {
    if (this.dialog.openDialogs.length < 1) {
      this.dialog.open(AuthComponent, {
        disableClose: false,
        data: {firstRun: false}}
      );
    }
  }

  private downloadDoc(doc: any): void {
    this.alveoService.getAudioFile(doc['alveo:url']).subscribe(
      data => {
        if (this.selectedDoc === doc) {
          this.alveoService.tmp_doc = doc;
          this.router.navigate(['./annotator']);
        }
      },
      error => {
        if (error=== 403 && !this.authService.isLoggedIn()) {
          this.requireLogin();
        }
      }
    );
  }
}
