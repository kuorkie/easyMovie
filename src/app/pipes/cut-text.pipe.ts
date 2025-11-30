import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cutText'
})
export class CutTextPipe implements PipeTransform {

  transform(value: string, maxLength:number = 100): string {
    if(value.length > maxLength) return `${value.slice(0,maxLength)} ...`
    return value
  }

}
