import { Component, Input } from '@angular/core';

import { AlveoService } from '../../../shared/alveo.service';
import { AuthService } from '../../../shared/auth.service';
import { SessionService } from '../../../shared/session.service';

import { Paths } from '../../../shared/paths';

@Component({
  selector: 'docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.css'],
})

export class DocsComponent {
  @Input() docs: any;
  selectedDoc: any = null;

  constructor(
    private sessionService: SessionService,
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
    this.authService.promptLogin();
  }

  private downloadDoc(doc: any): void {
    this.alveoService.getAudioFile(doc['alveo:url']).subscribe(
      docData => {
        if (this.selectedDoc === doc) {
          this.sessionService.setActiveDoc(doc, docData).then(
            () => {
              this.sessionService.navigate([Paths.Annotator]);
            }
          );
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
