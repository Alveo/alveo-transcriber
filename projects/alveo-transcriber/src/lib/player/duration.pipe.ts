import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'duration' })
export class DurationPipe implements PipeTransform {
  private previousValue: number;
  private cachedResult: string;

  transform(input: number): string {
    if (input == this.previousValue && this.cachedResult) {
      return this.cachedResult;
    }
    this.previousValue = input;

    const seconds = Math.floor((input % 60000) / 1000);
    const minutes = Math.floor(input / 60000);

    let formatted = (minutes > 0 ? minutes + ' minutes' : '');
    formatted += (seconds > 0 ? ' ' + seconds + ' seconds' : '');

    this.cachedResult = formatted;
    return this.cachedResult;
  }
}

@Pipe({ name: 'durationshort' })
export class DurationShortPipe implements PipeTransform {
  private previousValue: number;
  private cachedResult: string;

  transform(input: number): string {
    if (input == this.previousValue && this.cachedResult) {
      return this.cachedResult;
    }
    this.previousValue = input;

    const seconds = Math.floor((input % 60));
    const minutes = Math.floor(input / 60);

    let formatted = (minutes > 0 ? minutes + ':' : '0:');
    formatted += (seconds > 0 ? '' + (seconds > 9 ? seconds : '0' + seconds) : '00');

    this.cachedResult = formatted;
    return this.cachedResult;
  }
}
