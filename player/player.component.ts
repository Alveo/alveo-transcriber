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
import { Annotation } from '../shared/annotator.service';

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

  constructor(
    private annotatorService: AnnotatorService,
    private router: Router) {
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

  loadRegions(): void {
    this.annotations.forEach((annotation) => {
      let region = this.player.addRegion({
        id: annotation.id,
        start: annotation.start,
        end: annotation.end,
        color: 'hsla(100, 100%, 30%, 0.1)'
      }) // Doesn't return the region object FYI
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
          color: 'hsla(100, 100%, 30%, 0.1',
          loop: true
      });

      //(slider as HTMLInputElement).value = this.player.params.minPxPerSec;
    });

    /* Move cursor to beginning of region */
    this.player.on('region-click', (region: Region, e: any) => {
      e.stopPropagation(); // Stops the seek to mousePos event
      this.gotoRegion(region);
      console.log("Clicked: "+region.id);
      let annotation = this.annotatorService.getAnnotationByID(region.id)
      this.annotatorService.selectAnnotation(annotation)
    });

    this.player.on('region-update-end', (region: Region) => {
      let annotation = this.annotatorService.getAnnotationByID(region.id)
      annotation.start = region.start;
      annotation.end = region.end;
    });

    this.player.on('region-created', (region: Region) => {
      if (region.id.startsWith("wavesurfer_")) {
        this.annotatorService.createAnnotationFromSegment(
          {
            'id': region.id,
            'start': region.start,
            'end': region.end,
          });
      }
    });

    this.player.on('finish', () => {
      this.stop();
    });

    // Forces Angular to update component every second
    setInterval(() => {}, 1000);
  }

  gotoRegion(region: Region) {
    this.player.seekTo(region.start / this.player.getDuration());
  }

  playing(): boolean {
    return this._playing;
  }

  findRegion(id: string): Region {
    for (let region of this.player.regions) {
      if (region.id == id) {
        return region;
      }
    }
    return null;
  }
}
