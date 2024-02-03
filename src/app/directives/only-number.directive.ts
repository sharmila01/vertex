import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
    selector: '[onlyNumber]'
})

export class OnlyNumberDirective {
    constructor() { }

    @HostListener('keydown', ['$event']) onKeyDown(event) {
        let e = <KeyboardEvent> event;
        if ( (e.keyCode >= 48 && e.keyCode <= 57) || e.keyCode ==8 || (e.keyCode >= 33 && e.keyCode <= 40) || ([46, 8, 9, 27, 13, 110, 190, 12, 45, 144].indexOf(e.keyCode) !== -1) || (e.keyCode >= 96 && e.keyCode <= 105) ) {
   
            return;
        } else {
            e.preventDefault();
            
        }
    }
}