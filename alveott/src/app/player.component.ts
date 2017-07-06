import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { DataService } from './data.service';
import * as wavesurfer from 'wavesurfer.js';

@Component({
  selector: 'player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css'],
})

export class PlayerComponent implements OnInit {
  player: wavesurfer;
  loaded: boolean;

  constructor(public dataService: DataService) { }

  play(): void {
    this.player.play();
  }

  stop(): void {
    this.player.stop();
  }

  pause(): void {
    this.player.pause();
  }

  seek(position: number): void {
    this.player.seekTo(0);
    this.player.skip(position);
  }

  getPos(): number {
    return this.player.getCurrentTime();
  }

  getDuration(): number {
    return this.player.getDuration();
  }

  ngOnInit(): void {
    this.loaded = false;
    this.player = wavesurfer.create({
      container: '#waveform',
      waveColor: 'violet',
      progressColor: 'purple'
    });

    this.dataService.gen64if();
    this.dataService.genABif();
  }

  loadClip(): void {
    console.log("Loaded");
    this.player.loadArrayBuffer(this.dataService.blobtest);

    this.loaded = true;
  }
}
