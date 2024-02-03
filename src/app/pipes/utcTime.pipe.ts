import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'utcTime'
})

export class UtcTimePipe implements PipeTransform {
    transform(date: any): any {
        if(date) {
            let newDate  = new Date(date)
            return  new Date(newDate.getUTCFullYear(), newDate.getUTCMonth(), newDate.getUTCDate(), newDate.getUTCHours(), newDate.getUTCMinutes(), newDate.getUTCSeconds())
        } else {
            return ''
        }
        
    
    }
}