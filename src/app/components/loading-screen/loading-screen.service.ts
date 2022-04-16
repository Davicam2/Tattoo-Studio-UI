import { Injectable } from '@angular/core';
import { BehaviorSubject, pipe } from 'rxjs';
import { debounce } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class LoadingScreenService{

  private counter: number = 0;
  showLoader: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor() { }

  show(){
    this.counter++;
    //this.sleep(2000);
    this.showLoader.next(true)
  }

  hide(){
    this.counter--;
    if(this.counter > 0) return;
    this.showLoader.next(false);
  }

  sleep(ms){
    
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
     
    })
  }

}
