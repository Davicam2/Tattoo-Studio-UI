import { formatDate } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'tryParseDate'
})
export class DatePipe implements PipeTransform {

  transform(value: number, format: string): any {
    if(typeof value !== 'number'){
      console.log(new Date(value));
      return value;
    } else {
      return formatDate( new Date(value), format,'en-US');
    }
  }
}
