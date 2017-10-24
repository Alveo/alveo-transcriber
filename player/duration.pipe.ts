import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'duration' })
export class DurationPipe implements PipeTransform {
  transform(input: number): string {
    var seconds = Math.floor((input % 60000) / 1000);
    var minutes = Math.floor(input / 60000);

    var formatted = (minutes > 0 ? minutes+' minutes': '');
    formatted += (seconds > 0 ? ' '+seconds+' seconds': '');

    return formatted;
  }
}

@Pipe({ name: 'durationshort' })
export class DurationShortPipe implements PipeTransform {
  transform(input: number): string {
    var seconds = Math.floor((input % 60));
    var minutes = Math.floor(input / 60);

    var formatted = (minutes > 0 ? minutes+':': '0:');
    formatted += (seconds > 0 ? ''+(seconds > 9 ? seconds: '0'+seconds): '00');

    return formatted;
  }
}
