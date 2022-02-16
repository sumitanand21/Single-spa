import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'modelPipe'
})

export class ModelNamePipe implements PipeTransform {

  transform(value: any) {
    let lastIndexValue = '';
    if (value !== '' || value !== undefined) {
      lastIndexValue = value.substring(value.lastIndexOf('/') + 1, value.length);
      if (lastIndexValue.length >= 12) {
        lastIndexValue = lastIndexValue.slice(0, 12) + '..';
      } else {
        lastIndexValue = lastIndexValue;
      }
    }
    return lastIndexValue;
  }

}

@Pipe({ name: 'emptyvaluecheck' })
export class EmptyValueCheck implements PipeTransform {
  transform(value): any {
    if (value === '' || value === undefined || value == null) {
      return '-';
    } else {
      return value;
    }
  }
}

