import { OnInit } from '@angular/core';
import { Component, Input, HostListener } from '@angular/core';
import { Segment } from './segment';

import * as wavesurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/src/plugin/regions.js';
import Region from 'wavesurfer.js/src/plugin/regions.js';
import TimelinePlugin from 'wavesurfer.js/src/plugin/timeline.js';
import MinimapPlugin from 'wavesurfer.js/src/plugin/minimap.js';

import { PlayerControlService } from './player-control.service';

import { Clip } from './clip';

@Component({
  selector: 'player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css'],
})

export class PlayerComponent implements OnInit {
  player: wavesurfer;
  _playing: boolean;
  @Input() clip: Clip;
  @Input() audioData: ArrayBuffer;
  @Input() selected: Segment;

  constructor(public playCtrlService: PlayerControlService) { }

  play(): void {
    this.player.play();
    this._playing = true;
  }

  stop(): void {
    this.player.stop();
    this._playing = false;
  }

  pause(): void {
    this.player.pause();
    this._playing = false;
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
      var region = this.player.addRegion({
        start: segment.start,
        end: segment.end,
        color: 'hsla(100, 100%, 30%, 0.1)'
      })
    });

    this.zoom();
  }

  ngOnInit(): void {
    this._playing = false;

    this.player = wavesurfer.create({
      container: '#waveform',
      waveColor: 'black',
      progressColor: 'white',
      height: 200,
      controls: true,
      plugins: [
        RegionsPlugin.create(),
        TimelinePlugin.create({
          container: '#timeline'
        }),
        MinimapPlugin.create(),
      ]
    });

    this.player.loadArrayBuffer(this.audioData);

    var vm = this;
    this.player.on('ready', () => {
      vm.loadRegions();
    });

    this.player.on('region-click', (region: Region) => {
      vm.setActiveSegment(region);
    });

    // Forces Angular to update component every second
    setInterval(() => {}, 1000);
  }

  zoom(): void {
    this.player.zoom(50);
  }

  unzoom(): void {
    this.player.zoom(5);
  }

  playing(): boolean {
    return this._playing;
  }

  findSegment(start: number, end: number): Segment {
    var match = null;
    for (var segment of this.clip.segments) {
      if (segment.start == start && segment.end == end) {
        match = segment;
        break;
      }
    }
    return match;
  }

  setActiveSegment(region: Region): void {
    this.playCtrlService.activeSegment = this.findSegment(region.start, region.end);
  }
}
