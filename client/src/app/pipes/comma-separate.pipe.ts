import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'commaSeparate'
})
export class CommaSeparatePipe implements PipeTransform {

  transform(value: any): number {

    if (value) {
      let fval = value.toString().replace(/\s/g, '')

      value = fval.replaceAll(' ', '').replaceAll(',', '');
      return this.localeString(value).trim();

    }
    else {
      return 0;
    }

  }
  localeString(value: any) {
    if (value === '') return '';
    var parts = value.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }

}
