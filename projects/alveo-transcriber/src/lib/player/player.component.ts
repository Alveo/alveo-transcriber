import { OnInit, Input, Output, Component, EventEmitter } from '@angular/core';

/* WaveSurfer NPM headers */
import * as WaveSurfer from 'wavesurfer.js';
import * as Region from 'wavesurfer.js/dist/plugin/wavesurfer.regions';
import * as RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions';
import * as TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline';
import * as MinimapPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.minimap';

import { Annotation } from '../shared/annotation';

import { MatDialog } from '@angular/material';
import { DialogComponent } from '../dialog/dialog.component';

const BASE_COLOUR = 'rgba(0, 100, 0, 0.2)';
const SELECTED_COLOUR = 'rgba(0, 200, 200, 0.2)';

@Component({
  selector: 'avl-ngt-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css'],
})
export class PlayerComponent implements OnInit {
  @Output() loadingFinish = new EventEmitter();
  @Output() annotationEvent = new EventEmitter();
  @Input() annotations: Array<any>;
  @Input() clip: any;
  @Input() autoPlay = false;

  private ready: boolean= null;

  private player: WaveSurfer= null;
  private selectedRegion: any= null;

  public audioCurrentTime: number= 0;
  public audioDuration: number= 0;

  private zoom: number= 3;
  private zoom_threshold: number= 10;

  private isRebuildingRegions: boolean= false;

  constructor(
    private dialog: MatDialog,
  ) { }

  ngOnDestroy(): void {
    this.player.destroy();
  }

  ngOnInit(): void {
    // Do this to fix Angular redraw issues
    setInterval(() => {}, 100);

    // Initialise the player, won't be ready until it fires the 'ready' event after loading audio data
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
        })
      ]
    });

    // Begin loading audio data
    this.player.loadArrayBuffer(this.clip);

    // Set up deferred initialisation
    this.player.on('ready', () => {
      this.loadRegions(this.annotations);
      this.player.zoom(this.zoom);
      this.player.enableDragSelection({
          color: BASE_COLOUR,
      });

      this.setPlayerHeight(80);

      this.updateAudioDuration();

      this.ready = true;
      this.loadingFinish.emit({});
    });

    // On region click, we want to go to the beginning of the region, usually to play it from the start
    this.player.on('region-click', (region: Region, e: any) => {
      e.stopPropagation(); // Stop click from being overridden by mousepos

      this.annotationEvent.emit(
        {
          'type': 'select',
          'annotation': this.getAnnotationByID(region.id)
        }
      );
    });

    // When the player finishes, playing the file, reset to the beginning
    this.player.on('finish', () => {
      this.stop();
    });

    this.player.on('audioprocess', () => {
      this.updateAudioCurrentTime();
    });

    this.player.on('region-update-end', (region: Region) => {
      if (!this.ready) {
        return;
      }

      let annotation = this.getAnnotationByID(region.id);

      this.annotationEvent.emit(
        {
          'type': 'update-end',
          'annotation': annotation,
          'new-start': region.start,
          'new-end': region.end
        }
      );
    });

    this.player.on('region-created', (region: Region) => {
      if (this.ready) {
        if (region.id.startsWith('wavesurfer_')) {
          // Temporarily create a one-off event handler for once we finish creating a region
          const createFinish = this.player.on('region-update-end',
            (newRegion: Region) => {
              this.annotationEvent.emit(
                {
                  'type': 'create',
                  'id': newRegion.id,
                  'start': newRegion.start,
                  'end': newRegion.end,
                }
              );
              // You'd think createFinish.un() would work, but it does not.
              // Instead we do a slightly more roundabout approach to the intended effect.
              this.player.un(createFinish.name, createFinish.callback);
            }
          );
        }
      }
    });

    this.player.on('region-removed', (region: Region) => {
      if (!this.isRebuildingRegions) {
        this.annotationEvent.emit(
          {
            'type': 'delete',
            'annotation': this.getAnnotationByID(region.id)
          }
        );
      }
    });
  }

  public setPlayerHeight(pixels: number) {
    this.player.setHeight(pixels);
  }

  public dialogOpen(title: string, text: string): any {
    return this.dialog.open(DialogComponent, {data: {title: title, text: text}});
  }

  public play(): void {
    this.player.play();
  }

  public stop(): void {
    // Reset to beginning only if we're at the end and not a region end
    if (this.player.getCurrentTime() === this.player.getDuration()) {
      this.player.stop();
    }
  }

  public pause(): void {
    this.player.pause();
  }

  public seek(position: number): void {
    this.player.seekTo(0);
    this.player.skip(position);
  }

  public updateAudioCurrentTime(): void {
    this.audioCurrentTime = Math.floor(this.player.getCurrentTime());
  }

  private updateAudioDuration(): void {
    this.audioDuration = Math.floor(this.player.getDuration());
  }

  public playing(): boolean {
    return this.player.isPlaying();
  }

  public zoomIn(): void {
    if (this.zoom < this.zoom_threshold) {
      this.zoom += 1;
    }
    this.player.zoom(this.zoom);
  }

  public zoomOut(): void {
    if (this.zoom > 0) {
      this.zoom -= 1;
    }
    this.player.zoom(this.zoom);
  }

  public replayLast(seconds: number): void {
    let position = (this.player.getCurrentTime() - seconds) / this.player.getDuration();
    if (position < 0) {
      position = 0;
    }
    this.player.seekTo(position);
  }

  public isReady(): boolean {
    return this.ready;
  }

  public loopSelectedRegion(): void {
    this.selectedRegion.playLoop();
  }

  public buildRegions(annotations: Array<Annotation>) {
    this.isRebuildingRegions = true;
    this.player.clearRegions();
    this.loadRegions(annotations);
    this.isRebuildingRegions = false;
  }

  public loadRegions(annotations: Array<Annotation>): void {
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

  public gotoRegion(region: Region): void {
    this.player.seekTo(region.start / this.player.getDuration());
  }

  private findRegion(id: string): Region {
    return this.player.regions.list[id];
  }

  public selectPreviousRegion(): Region {
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
      this.annotationEvent.emit(
        {
          'type': 'select',
          'annotation': this.getAnnotationByID(prevRegion)
        }
      );
    }
  }

  public selectNextRegion(): Region {
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
      this.annotationEvent.emit(
        {
          'type': 'select',
          'annotation': this.getAnnotationByID(nextRegion)
        }
      );
    }
  }

  public countRegions(): number {
    return Object.keys(this.player.regions.list).length;
  }

  public deleteAnnotation(annotation: Annotation): void {
    const region = this.findRegion(annotation.id);
    region.remove();
  }

  // This should not be called by this component itself
  public selectAnnotation(annotation: Annotation, ignoreAutoplay: boolean): void {
    if (this.selectedRegion !== null) {
      this.selectedRegion.update({color: BASE_COLOUR});
      this.selectedRegion = null;
    }

    let region = null;
    if (annotation !== null) {
      region = this.findRegion(annotation.id);
    }

    if (region !== null && region !== undefined) {
      if (this.playing()) {
        this.pause();
      }

      this.gotoRegion(region);

      region.update({color: SELECTED_COLOUR});

      if (this.autoPlay && !ignoreAutoplay) {
        region.play();
      }

      this.selectedRegion = region;
    }
  }

  public replayAnnotation(annotation: Annotation): void {
    const region = this.findRegion(annotation.id);
    region.play();
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
