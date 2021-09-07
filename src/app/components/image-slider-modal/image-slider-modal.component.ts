import { Component, Input, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-image-slider-modal',
  templateUrl: './image-slider-modal.component.html',
  styleUrls: ['./image-slider-modal.component.scss']
})
export class ImageSliderModalComponent implements OnInit {

  @Input() imageUrls: string[];




  customOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    margin: 10,
    nav: true
  }



  constructor() { }

  ngOnInit(): void {

    console.log(this.imageUrls);
  }

}
