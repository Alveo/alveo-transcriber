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

  private revisions: Array<Transcription>;

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
    this.revisions.push(this.transcription);

    const remoteId = this.transcription.remoteId;

    if (remoteId !== null && this.authService.isLoggedIn()) {
      const response = await this.atsClient.getRemoteStorage(remoteId, 1);
      const time = Date.parse(response.timestamp+UTC);
      let transcription = new Transcription(response['remote_id'], response['annotations'], time);

      this.revisions.push(transcription);
    }
  }
}
