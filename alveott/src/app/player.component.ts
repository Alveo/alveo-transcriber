import { OnInit } from '@angular/core';
import { Component, Input, HostListener } from '@angular/core';

import * as wavesurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/src/plugin/regions.js';

import { Clip } from './clip';

@Component({
  selector: 'player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css'],
})

export class PlayerComponent implements OnInit {
  player: wavesurfer;
  loaded: boolean;
  @Input() clip: Clip;
  @Input() audioData: ArrayBuffer;

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
    return Math.floor(this.player.getCurrentTime());
  }

  getDuration(): number {
    return Math.floor(this.player.getDuration());
  }

  loadRegions(): void {
    this.clip.segments.forEach((segment) => {
      this.player.addRegion({
        start: segment.start,
        end: segment.end,
        color: 'hsla(100, 100%, 30%, 0.1)'
      })
    });
  }

  ngOnInit(): void {
    this.loaded = false;

    this.player = wavesurfer.create({
      container: '#waveform',
      waveColor: 'black',
      progressColor: 'white',
      plugins: [
        RegionsPlugin.create()
      ]
    });

    this.player.loadArrayBuffer(this.audioData);

    var vm = this;
    this.player.on('ready', () => {
      vm.loadRegions();
    });

    // Forces Angular to update component every second
    setInterval(() => {}, 1000);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.player.drawer.containerWidth = event.target.innerWidth;
    this.player.drawBuffer();
  }
}
