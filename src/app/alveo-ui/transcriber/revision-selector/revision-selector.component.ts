import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService } from '../../shared/auth.service';
import { AlveoTransServClientService } from '../../../alveo-transserv-client/alveo-transserv-client.service';
import { Transcription } from '../../../transcription/transcription';

const UTC = "+0000"; // Sync times

@Component({
  selector: 'app-revision-selector',
  templateUrl: './revision-selector.component.html',
  styleUrls: ['./revision-selector.component.css']
})
export class RevisionSelectorComponent implements OnInit {
  public isRevisionWindowOpen = false;
  public transcription: Transcription= null;

  private revisions: any;

  private isLoading: boolean= true;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private atsClient: AlveoTransServClientService,
    private authService: AuthService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.transcription = this.data.transcription;
    this.loadRevisions();
  }

  private async loadRevisions(): Promise<any> {
    this.revisions = new Array<Transcription>();
    //this.addRevision(this.transcription, 'local');

    const remoteId = this.transcription.remoteId;

    const canAccess = (remoteId !== null && this.authService.isLoggedIn());

    if (canAccess) {
      const response = await this.atsClient.getRemoteStorage(remoteId);
      this.addRevision(response);

      let total_versions = response['total_versions'] - 2;

      for (let i=total_versions; i>=0; i--) {
        const response = await this.atsClient.getRemoteStorage(remoteId, i);
        this.addRevision(response);
      }
    }

    if (this.transcription.isPendingUpload || !canAccess) {
      this.revisions.push({
        transcription: this.transcription,
        type: 'local',
        version: undefined,
        totalAnnotations: this.transcription.annotations.length,
        author: undefined
      })
    }

    this.isLoading = false;
  }

  private addRevision(response: any, type: string= "remote"): void {
    const time = Date.parse(response['timestamp']+UTC);
    let transcription = new Transcription(
      response['id'],
      response['transcription'],
      time
    );

    this.revisions.push({
      transcription: transcription,
      type: type,
      version: response['version'],
      totalAnnotations: transcription.annotations.length,
      author: response['author']['version']['remote_id']
    })

  }
}
