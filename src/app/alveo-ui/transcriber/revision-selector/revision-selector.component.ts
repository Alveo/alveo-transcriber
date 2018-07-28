import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
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
  private selectedRevision: any= null;

  private isLoading: boolean= true;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<RevisionSelectorComponent>,
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

    this.revisions.push({
      transcription: this.transcription,
      selectable: false,
      type: 'local',
      version: undefined,
      totalAnnotations: this.transcription.annotations.length,
      author: undefined
    })

    const remoteId = this.transcription.remoteId;

    if (remoteId !== null && this.authService.isLoggedIn()) {
      const response = await this.atsClient.getRemoteStorage(remoteId);
      this.addRevision(response);

      let total_versions = response['total_versions'] - 2;

      for (let i=total_versions; i>=0; i--) {
        const response = await this.atsClient.getRemoteStorage(remoteId, i);
        this.addRevision(response);
      }
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
      selectable: true,
      version: response['version'],
      totalAnnotations: transcription.annotations.length,
      author: response['author']['version']['remote_id']
    })
  }

  public selectRevision(revision: any): void {
    if (revision.selectable) {
      this.selectedRevision = revision;
    }
  }

  public finalizeData(): void {
    if (this.selectedRevision != null) {
      this.dialogRef.close({ transcription: this.selectedRevision.transcription });
    } else {
      console.log("Warning: No revision selected, this shouldn't occur");
    }
  }
}
