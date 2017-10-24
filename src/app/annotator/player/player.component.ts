import { OnInit } from '@angular/core';
import { Component, Input, HostListener } from '@angular/core';
import { Router, NavigationStart, Event } from '@angular/router';

/* WaveSurfer NPM headers */ 
import WaveSurfer from 'wavesurfer.js';
import Region from 'wavesurfer.js/dist/plugin/wavesurfer.regions';
import RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions';
import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline';
import MinimapPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.minimap';

import { AnnotatorService } from '../shared/annotator.service';

class Segment {
  start: number;
  end: number;
}

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
  player: WaveSurfer;
  _playing: boolean;
  @Input() clip: any;
  @Input() annotations: any;

  regionCache: Cache[] = [];

  constructor(
    public annotatorService: AnnotatorService,
    public router: Router) {
    router.events.subscribe( (event:Event) => {
      if (event instanceof NavigationStart) {
        this.player.destroy();
      }
    });

    this.annotatorService.annotationsEvent.subscribe((mode)=>{
      if (mode == "rebuild") {
        this.player.clearRegions();
        this.annotations = this.annotatorService.getAnnotations();
        this.loadRegions();
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
    this.annotations.forEach((segment) => {
      console.log("region add"); // this.wrapper is null occurs on large files without this line

      this.player.addRegion({
        start: segment.start,
        end: segment.end,
        color: 'hsla(100, 100%, 30%, 0.1)'
      }) // Doesn't return the region object FYI

      // It's hacky: retrieves the last added region
      var region = this.player.regions.list[Object.keys(this.player.regions.list).pop()];
      this.addCache(segment, region);
    });
  }

  ngOnInit(): void {
    this._playing = false;

    this.player = WaveSurfer.create({
      container: '#waveform',
      waveColor: 'black',
      progressColor: 'white',
      controls: true,
      barHeight: 15,
      plugins: [
        MinimapPlugin.create(),
        RegionsPlugin.create(),
        TimelinePlugin.create({
          container: '#timeline'
        }),
      ]
    });

    this.player.loadArrayBuffer(this.clip.slice(0));
    /*
    var slider = document.querySelector('[data-action="zoom"]');
    slider.addEventListener('input', () => {
      var value = (slider as HTMLInputElement).value;
      this.player.zoom(Number(value));
    });
     */

    this.player.on('ready', () => {
      this.loadRegions();
      this.player.zoom(3);
      this.player.enableDragSelection({
          color: 'rgba(0, 255, 0, 0.2)',
          loop: true
      });

      //(slider as HTMLInputElement).value = this.player.params.minPxPerSec;
    });

    this.player.on('region-click', (region: Region) => {
      //this.appService.audioPlayer.activeSegment = this.findSegment(region);
    });

    this.player.on('region-updated', (region: Region) => {
      //this.appService.audioPlayer.activeSegment = this.findSegment(region);
    });

    this.player.on('region-update-end', (region: Region) => {
      let segment = this.findSegment(region);
      segment.start = region.start;
      segment.end = region.end;
    });

    this.player.on('finish', () => {
      this.stop();
    });

    // Forces Angular to update component every second
    setInterval(() => {}, 1000);
  }

  playing(): boolean {
    return this._playing;
  }

  findSegment(region: Region): Segment {
    let match = null;
    for (var cache of this.regionCache) {
      if (cache.region == region) {
        match = cache.segment;
        break;
      }
    }
    return match;
  }

  findRegion(segment: Segment): Region{
    let match = null;
    for (var cache of this.regionCache) {
      if (cache.segment == segment) {
        match = cache.region;
        break;
      }
    }
    return match;
  }
}
