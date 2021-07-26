import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'maxLength'
})
export class MaxLengthPipe implements PipeTransform {
  transform(value: string, limit: number){
    if (value.length > limit) {
      return value.substring(0, limit) + '\u2026';
    } else {
      return value;
    }
  }
}
