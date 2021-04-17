import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'phoneNumber'})
export class PhoneNumberPipe implements PipeTransform {
    transform(input: number){
        let phNum = input.toString();

        if(!phNum) return; // return on empty
        phNum = phNum.replace(/[^0-9]/g, ''); // ensure only numbers
       
        if(phNum.length > 10) phNum = phNum.substring(0,10); // max 10 numbers

        let formattedNumber = '';
        if(phNum.length < 4){
            formattedNumber = phNum;
        } else if (phNum.length < 7) {
            formattedNumber = `(${phNum.substring(0,3)}) ${phNum.substring(3,phNum.length)}`
        } else {
            formattedNumber = `(${phNum.substring(0,3)}) ${phNum.substring(3,6)}-${phNum.substr(6,phNum.length)}`
        }

        return formattedNumber;

    }
}