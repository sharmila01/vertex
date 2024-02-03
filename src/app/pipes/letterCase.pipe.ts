import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'letterCase'
})

export class LetterCasePipe implements PipeTransform {
    transform(value:string = ''): string {
        value = value.toString()
        if(value)
            return value.charAt(0).toUpperCase() + value.substr(1).toLowerCase()
    }

}