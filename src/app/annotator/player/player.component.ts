import { OnInit, Input, Output, Component, EventEmitter } from '@angular/core';
import { Router, NavigationStart, Event } from '@angular/router';

/* WaveSurfer NPM headers */
import * as WaveSurfer from 'wavesurfer.js';
import * as Region from 'wavesurfer.js/dist/plugin/wavesurfer.regions';
import * as RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions';
import * as TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline';
import * as MinimapPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.minimap';

import { Annotation } from '../shared/annotation';

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
  @Output() onReady = new EventEmitter();
  @Output() annotationEvent = new EventEmitter();
  @Input() annotations: Array<any>;
  @Input() clip: any;
  @Input() autoPlay: boolean = false;

  private ready: boolean = null;

  private player: WaveSurfer = null;
  private selectedRegion: any = null;

  private zoom: number;
  private zoom_threshold = 10;

  constructor(
    private dialog: MatDialog,
    private router: Router
  ) { }

  public rebuild(annotations: Array<Annotation>) {
    this.player.clearRegions();
    this.loadRegions(annotations);
  }

  public selectAnnotation(annotation: any) {
    if (this.ready) {
      if (annotation['new'] !== null) {
        const newRegion = this.findRegion(annotation['new']['id']);
        console.log(annotation['silently']);
        this.selectRegion(newRegion, annotation['silently']);
      }
    }
  }

  public resize(height: number) {
    this.setHeight(height);
  }

  ngOnInit(): void {
    this.router.events.subscribe( (event: Event) => {
      if (event instanceof NavigationStart) {
        this.player.destroy();
      }
    });

    this.zoom = 3;
    this.player = WaveSurfer.create({
      container: '#waveform',
      waveColor: 'black',
      progressColor: 'white',
      controls: true,
      normalize: true,
      plugins: [
        RegionsPlugin.create(),
        TimelinePlugin.create({
          container: '#timeline'
        }),
      ]
    });

    // Use slice to prevent detached buffer issues
    this.player.loadArrayBuffer(this.clip.slice(0));

    this.player.on('ready', () => {
      this.loadRegions(this.annotations);
      this.player.zoom(this.zoom);
      this.player.enableDragSelection({
          color: BASE_COLOUR,
      });

      this.setHeight(80);

      this.ready = true;
      this.onReady.emit({});
    });

    /* Move cursor to beginning of region */
    this.player.on('region-click', (region: Region, e: any) => {
      e.stopPropagation(); // Stop click from being overridden by mousepos
      this.selectRegion(region);
    });

    this.player.on('region-update-end', (region: Region) => {
      if (this.ready === true) {
        const annotation = this.getAnnotationByID(region.id)

        if (annotation !== null) {
          annotation.start = region.start;
          annotation.end = region.end;

          this.selectRegion(region);

          this.annotationEvent.emit(
            {
              'type': 'update',
              'annotation': this.getAnnotationByID(region.id)
            }
          );
        }
      }
    });

    this.player.on('region-created', (region: Region) => {
      if (this.ready === true) {
        if (region.id.startsWith('wavesurfer_')) {
          const createFinish = this.player.on('region-update-end', 
            (region: Region) => {
              this.annotationEvent.emit(
                {
                  'type': 'create',
                  'id': region.id,
                  'start': region.start,
                  'end': region.end,
                }
              );
              this.selectRegion(region, true);

              // You'd think this would work, but it doesn't: createFinish.un();
              // So instead we do a slightly more roundabout approach.
              this.player.un(createFinish.name, createFinish.callback);
            }
          );
        }
      }
    });

    this.player.on('finish', () => {
      this.stop();
    });

    setInterval(() => {}, 100);
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

  loadRegions(annotations: Array<Annotation>): void {
    if (this.player.handlers !== null) { // Hackish fix to stop wrapper.null implosions
      for (const annotation of annotations) {
        this.player.addRegion({
          id: annotation.id,
          start: annotation.start,
          end: annotation.end,
          color: BASE_COLOUR,
        });
      }
    }
  }

  public setHeight(pixels: number) {
    this.player.setHeight(pixels);
  }

  zoomIn() {
    if (this.zoom < this.zoom_threshold) {
      this.zoom += 1;
    }
    this.player.zoom(this.zoom);
  }
  zoomOut() {
    if (this.zoom > 0) {
      this.zoom -= 1;
    }
    this.player.zoom(this.zoom);
  }

  gotoRegion(region: Region) {
    this.player.seekTo(region.start / this.player.getDuration());
  }

  playing(): boolean {
    return this.player.isPlaying();
  }

  unselectRegion(region: Region): void {
    if (region !== null) {
      region.update({color: BASE_COLOUR});
      this.selectedRegion = null;
    }
  }

  public focusRegion(region: Region): void {
    this.annotationEvent.emit(
      {
        'type': 'select',
        'annotation': this.getAnnotationByID(region.id)
      }
    );
  }

  selectRegion(region: Region, ignoreAutoplay: boolean= false): void {
    if (region !== null && region !== undefined) {

      if (region !== this.selectedRegion) {
        if (this.playing()) {
          this.pause();
        }
        this.gotoRegion(region);
      }

      this.unselectRegion(this.selectedRegion);

      region.update({color: SELECTED_COLOUR});

      if (this.autoPlay && !ignoreAutoplay) {
        region.play();
      }

      this.annotationEvent.emit(
        {
          'type': 'select-noemit',
          'annotation': this.getAnnotationByID(region.id)
        }
      );

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

  deleteSelectedRegion(): Promise<any> {
    const dialogStatus = this.dialogOpen('Warning', 'Are you sure you wish to delete this segment?');
    return new Promise(
      (resolve, reject) => {
        dialogStatus.afterClosed().subscribe(result => {
          if (result === true) {
            this.deleteAnnotationByID(this.selectedRegion.id);
            const delRegion = this.selectedRegion;
            this.unselectRegion(delRegion);
            delRegion.remove();
            resolve();
          }
        });
      }
    );
  }

  public deleteAnnotationByID(id: string): boolean {
    for (const annotation of this.annotations) {
      if (annotation.id === id) {
        if (id = this.selectedRegion.id) {
          this.selectRegion(null);
        }

        const index = this.annotations.indexOf(annotation);
        if (index !== -1) {
          this.annotations.splice(index, 1);
        }

        return true;
      }
    }
    return false;
  }

  public getAnnotationByID(id: string): Annotation {
    for (const annotation of this.annotations) {
      if (annotation.id === id) {
        return annotation;
      }
    }
    return null;
  }

}
