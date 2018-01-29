import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'annotation' })
export class AnnotationPipe implements PipeTransform {
  transform(input: number): string {
    return input.toFixed(2);
  }
}
