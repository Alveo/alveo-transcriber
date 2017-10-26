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

const BASE_COLOUR = 'rgba(0, 100, 0, 0.2)';
const SELECTED_COLOUR = 'rgba(0, 200, 200, 0.2)';

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

  annotatorSubscription: any;

  constructor(
    private annotatorService: AnnotatorService,
    private router: Router) {
    router.events.subscribe( (event:Event) => {
      if (event instanceof NavigationStart) {
        this.player.destroy();
        this.annotatorSubscription.unsubscribe();
      }
    });

    this.annotatorSubscription = this.annotatorService.annotationsEvent.subscribe((event)=>{
      if (event.type == "rebuild") {
        this.player.clearRegions();
        this.annotations = this.annotatorService.getAnnotations();
        this.loadRegions();
      }
      else if (event.type == "selectAnnotation") {
        if (event.old != null && event.old != undefined) {
          let oldRegion = this.findRegion(event.old.id);
          this.unselectRegion(oldRegion);
        }

        if (event.new != null) {
          let newRegion = this.findRegion(event.new.id);
          this.selectRegion(newRegion);
        }
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
    if (this.player.handlers != null) { // Hackish fix to stop wrapper.null implosions
      for (let annotation of this.annotations) {
        this.player.addRegion({
          id: annotation.id,
          start: annotation.start,
          end: annotation.end,
          color: BASE_COLOUR,
        });
      }
    }

    if (this.annotations.length > 0) {
      this.selectRegion(this.findRegion(this.annotations[0].id))
    }
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
          color: BASE_COLOUR,
          loop: true
      });

      //(slider as HTMLInputElement).value = this.player.params.minPxPerSec;
    });

    /* Move cursor to beginning of region */
    this.player.on('region-click', (region: Region, e: any) => {
      e.stopPropagation(); // Stop click from being overridden by mousepos
      let annotation = this.annotatorService.getAnnotationByID(region.id)
      this.annotatorService.selectAnnotation(annotation)
    });

    this.player.on('region-update-end', (region: Region) => {
      let annotation = this.annotatorService.getAnnotationByID(region.id)
      annotation.start = region.start;
      annotation.end = region.end;

      this.selectRegion(region);
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

  unselectRegion(region: Region): void {
    if (region != undefined)
      region.update({color:BASE_COLOUR});
  }

  selectRegion(region: Region): void {
    if (region != undefined) {
      this.gotoRegion(region);
      region.update({color:SELECTED_COLOUR});
    }
  }

  findRegion(id: string): Region {
    return this.player.regions.list[id];
  }
}
