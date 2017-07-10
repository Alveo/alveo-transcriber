import { OnInit } from '@angular/core';
import { Component, Input, HostListener } from '@angular/core';
import { Router, NavigationStart, Event } from '@angular/router';

import * as wavesurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/src/plugin/regions.js';
import Region from 'wavesurfer.js/src/plugin/regions.js';
import TimelinePlugin from 'wavesurfer.js/src/plugin/timeline.js';
import MinimapPlugin from 'wavesurfer.js/src/plugin/minimap.js';

import { PlayerControlService } from './player-control.service';

import { Clip } from './clip';
import { Segment } from './segment';

class Cache {
  segment: Segment;
  region: Region;

  constructor(segment: Segment, region: Region) {
    this.segment = segment;
    this.region = region;
  }
}

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


  regionCache: Cache[] = [];

  constructor(public router: Router,
    public playCtrlService: PlayerControlService) { 
    router.events.subscribe( (event:Event) => {
      if (event instanceof NavigationStart) {
        this.player.destroy();
      }
    });
  }

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

  addCache(segment: Segment, region: Region): void {
    this.regionCache.push(new Cache(segment, region));
  }

  loadRegions(): void {
    this.clip.segments.forEach((segment) => {
      this.player.addRegion({
        start: segment.start,
        end: segment.end,
        color: 'hsla(100, 100%, 30%, 0.1)'
      }) // Doesn't return the region object FYI

      // It's hacky: retrieves the last added region
      var region = this.player.regions.list[Object.keys(this.player.regions.list).pop()];
      this.addCache(segment, region);
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

    this.player.on('ready', () => {
      this.loadRegions();
    });

    this.player.on('region-click', (region: Region) => {
      this.playCtrlService.activeSegment = this.findSegment(region);
    });

    this.player.on('region-update-end', (region: Region) => {
      let segment = this.findSegment(region);
      segment.start = region.start;
      segment.end = region.end;
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

  findSegment(region: Region): Segment {
    let match = null;
    for (var cache of this.regionCache) {
      console.log(cache);
      if (cache.region == region) {
        match = cache.segment;
        break;
      }
    }
    return match;
  }
}
