

import { NgModule } from '@angular/core';
import {PhoneNumberPipe} from './';

@NgModule({
    declarations:[PhoneNumberPipe],
    imports:[],
    exports:[PhoneNumberPipe],
    providers:[PhoneNumberPipe]
})

export class AppPipesModule { }