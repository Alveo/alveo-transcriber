import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpModule } from '@angular/http';

@Injectable()
export class DataService {
  // TODO sync clips from /request-dat
  // deploy script
  
  selected = null;
  clips = [];

  private online$: boolean = navigator.onLine;
  constructor() {
    window.addEventListener('online', () => {this.online$ = true});
    window.addEventListener('offline', () => {this.online$ = false});
  };

  syncObs = () => {
    return Observable
        .interval(5000);
  }

  pullData():void {
    var vm = this;
    this.syncObs().subscribe(
      function() {
        if (vm.online$) {
          console.log("Online");
        } else {
          console.log("Offline");
        };
      });

    this.clips = [
      {
            "id": "0",
            "label": "TestWWWWWWWWWW",
            "audio_url": "",
            "duration": 4730,
            "segments": [
                {
                    "start": 0.000,
                    "end": 7.1239,
                    "speaker": "1",
                    "annotation": "",
                },
                {
                    "start": 8.2383,
                    "end": 14.2395,
                    "speaker": 2,
                    "annotation": "",
                },
                {
                    "start": 16.2333,
                    "end": 19.2395,
                    "speaker": "",
                    "annotation": "",
                }
            ]
        },
        {
            "id": "1",
            "label": "Test Test Test Test Test Test Test Test Test Test Test Test",
            "audio_url": "",
            "duration": "63812",
            "segments": [
                {
                    "start": 0.000,
                    "end": 5.732,
                    "speaker": "1",
                    "annotation": "",
                },
                {
                    "start": 6.9271,
                    "end": 11.3293,
                    "speaker": "",
                    "annotation": "",
                }]
        },
        {
            "id": "2",
            "label": "Audio.wav",
            "audio_url": "",
            "duration": "4232000",
            "segments": [
                {
                    "start": 0.000,
                    "end": 1.763,
                    "speaker": "1",
                    "annotation": "",
                },
                {
                    "start": 2.132,
                    "end": 6.423,
                    "speaker": "",
                    "annotation": "",
                },
                {
                    "start": 7.432,
                    "end": 11.1292,
                    "speaker": "1",
                    "annotation": "Testing",
                },
                {
                    "start": 14.3923,
                    "end": 23.2391,
                    "speaker": "2",
                    "annotation": "",
                }]
        } 
    ];
  }
}
