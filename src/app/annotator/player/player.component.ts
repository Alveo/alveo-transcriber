import { OnInit } from '@angular/core';
import { Component, Input, HostListener } from '@angular/core';
import { Router, NavigationStart, Event } from '@angular/router';

/* WaveSurfer NPM headers */
import * as WaveSurfer from 'wavesurfer.js';
import * as Region from 'wavesurfer.js/dist/plugin/wavesurfer.regions';
import * as RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions';
import * as TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline';
import * as MinimapPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.minimap';

import { AnnotatorService } from '../shared/annotator.service';
import { Annotation } from '../shared/annotator.service';

import { MatDialog } from '@angular/material';
import { Dialog } from '../dialog/dialog.component';

const BASE_COLOUR = 'rgba(0, 100, 0, 0.2)';
const SELECTED_COLOUR = 'rgba(0, 200, 200, 0.2)';

@Component({
  selector: 'player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css'],
})
export class PlayerComponent implements OnInit {
  player: any;
  @Input() clip: any;
  @Input() annotations: any;

  annotatorSubscription: any;

  selectedRegion: any;

  ready: boolean;

  constructor(
    private dialog: MatDialog,
    private annotatorService: AnnotatorService,
    private router: Router) {
    router.events.subscribe( (event: Event) => {
      if (event instanceof NavigationStart) {
        this.player.destroy();
        this.annotatorSubscription.unsubscribe();
      }
    });

    this.annotatorSubscription = this.annotatorService.annotationsEvent.subscribe((event) => {
      if (event.type === 'rebuild') {
        this.player.clearRegions();
        this.annotations = this.annotatorService.getAnnotations();
        this.loadRegions();
      }
      /*
      else if (event.type === "selectAnnotation") {
        if (event.new !== null) {
          let newRegion = this.findRegion(event.new.id);
          this.selectRegion(newRegion);
        }
      }*/
    });
  }

  play(): void {
    this.player.play();
  }

  stop(): void {
    if (this.player.getCurrentTime() === this.player.getDuration()) {
      // Reset to beginning only if we're at the end and not a region end
      this.player.stop();
    }
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
    if (this.player.handlers !== null) { // Hackish fix to stop wrapper.null implosions
      for (const annotation of this.annotations) {
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
      });

      this.ready = true;
      // (slider as HTMLInputElement).value = this.player.params.minPxPerSec;
    });

    /* Move cursor to beginning of region */
    this.player.on('region-click', (region: Region, e: any) => {
      e.stopPropagation(); // Stop click from being overridden by mousepos
      this.selectRegion(region);
    });

    this.player.on('region-update-end', (region: Region) => {
      if (this.ready === true) {
        const annotation = this.annotatorService.getAnnotationByID(region.id)

        annotation.start = region.start;
        annotation.end = region.end;

        this.selectRegion(region);
      }
    });

    this.player.on('region-created', (region: Region) => {
      if (this.ready === true) {
        if (region.id.startsWith('wavesurfer_')) {
          this.annotatorService.createAnnotationFromSegment(
            {
              'id': region.id,
              'start': region.start,
              'end': region.end
            });
        }
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
    return this.player.isPlaying();
  }

  unselectRegion(region: Region): void {
    if (region !== undefined) {
      region.update({color: BASE_COLOUR});
      this.selectedRegion = null;
    }
  }

  selectRegion(region: Region): void {
    if (region !== undefined) {
      this.unselectRegion(this.selectedRegion);

      this.gotoRegion(region);
      region.update({color: SELECTED_COLOUR});

      const annotation = this.annotatorService.getAnnotationByID(region.id)
      this.annotatorService.selectAnnotation(annotation)

      this.selectedRegion = region;
    }
  }

  findRegion(id: string): Region {
    return this.player.regions.list[id];
  }

  selectPreviousRegion(): Region {
    let beginning = null;
    if (this.selectedRegion === null) {
      beginning = this.player.getCurrentTime();
    } else {
      beginning = this.selectedRegion.start;
    }
    let lower = 0;

    let prevRegion = null;

    // regions.list is unsorted JSON
    for (const regionID of Object.keys(this.player.regions.list)) {
      const region = this.player.regions.list[regionID];
      if (region.start < beginning) {
        if (lower < region.start) {
          lower = region.start;
          prevRegion = region;
        }
      }
    }

    if (prevRegion !== null) {
      this.selectRegion(prevRegion);
    }
  }

  selectNextRegion(): Region {
    let beginning = null;
    if (this.selectedRegion === null) {
      beginning = this.player.getCurrentTime();
    } else {
      beginning = this.selectedRegion.start;
    }
    let higher = this.player.getDuration();

    let nextRegion = null;

    // regions.list is unsorted JSON
    for (const regionID of Object.keys(this.player.regions.list)) {
      const region = this.player.regions.list[regionID];
      if (region.start > beginning) {
        if (higher > region.start) {
          higher = region.start;
          nextRegion = region;
        }
      }
    }
    if (nextRegion !== null) {
      this.selectRegion(nextRegion);
    }
  }

  countRegions(): number {
    return Object.keys(this.player.regions.list).length;
  }

  replayLast(seconds: number) {
    let position = (this.player.getCurrentTime() - seconds) / this.player.getDuration();
    if (position < 0) {
      position = 0;
    }

    this.player.seekTo(position);
  }

  replaySelectedRegion() {
    this.selectedRegion.play();
  }

  loopSelectedRegion() {
    this.selectedRegion.playLoop();
  }

  isReady(): boolean {
    return this.ready;
  }

  dialogOpen(title: string, text: string): any {
    return this.dialog.open(Dialog, {data: {title: title, text: text}});
  }

  deleteRegion(): void {
    const dialogStatus = this.dialogOpen('Warning', 'Are you sure you wish to delete this segment?');
    dialogStatus.afterClosed().subscribe(result => {
      if (result === true) {
        this.annotatorService.deleteAnnotationByID(this.selectedRegion.id);
        const delRegion = this.selectedRegion;
        this.unselectRegion(delRegion);
        delRegion.remove();
      }
    });
  }
}
