import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'durationshort' })
export class DurationShortPipe implements PipeTransform{
  transform(input: number): string {
    var seconds = Math.floor((input % 60));
    var minutes = Math.floor(input / 60);

    var formatted = (minutes > 0 ? minutes+':': '0:');
    formatted += (seconds > 0 ? ''+(seconds > 9 ? seconds: '0'+seconds): '00');

    console.log(input);

    return formatted;
  }
}
