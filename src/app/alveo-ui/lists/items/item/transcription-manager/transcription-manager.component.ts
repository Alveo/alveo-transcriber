import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { AuthService } from '../../../../shared/auth.service';
import { AlveoTransServClientService } from '../../../../../alveo-transserv-client/alveo-transserv-client.service';
import { Transcription } from '../../../../../transcription/transcription';

@Component({
  selector: 'app-transcription-manager',
  templateUrl: './transcription-manager.component.html',
  styleUrls: ['./transcription-manager.component.css']
})
export class TranscriptionManagerComponent implements OnInit {
  public transcriptionKey: string= null;
  public isLoading: boolean= true;
  public selectedTranscription: Transcription= null;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<TranscriptionManagerComponent>,
    private atsClient: AlveoTransServClientService,
    public authService: AuthService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.isLoading = false;
  }
}
