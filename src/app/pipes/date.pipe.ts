import { formatDate } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'tryParseDate'
})
export class DatePipe implements PipeTransform {

  transform(value: number, format: string): any {
    let vDate = new Date(value).toString();
  
    if(vDate === 'Invalid Date'){
      return value;
    } else {
      return formatDate( new Date(value), format,'en-US');
    }
  }
}
