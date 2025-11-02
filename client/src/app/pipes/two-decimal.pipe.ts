import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'twoDecimal'
})
export class TwoDecimalPipe implements PipeTransform {

  transform(value: string): string {
    return parseFloat(value).toFixed(2);
  }

}
