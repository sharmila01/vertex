import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'separator'
})

export class SeparatorPipe implements PipeTransform {
    transform(value, limit) {
        // console.log('value => '+ value + ' ==> limi t =>> '+ limit + 'type of => '+ typeof limit)
        return Number(value).toLocaleString(undefined, {maximumFractionDigits: limit})
    }
}