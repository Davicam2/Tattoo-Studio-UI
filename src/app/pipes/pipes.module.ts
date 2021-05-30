import { NgModule } from '@angular/core';
import {PhoneNumberPipe} from './';
import { DatePipe } from './date.pipe';

@NgModule({
    declarations:[PhoneNumberPipe, DatePipe],
    imports:[],
    exports:[PhoneNumberPipe, DatePipe],
    providers:[PhoneNumberPipe, DatePipe]
})

export class AppPipesModule { }