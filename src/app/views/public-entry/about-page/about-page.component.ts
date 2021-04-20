import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.scss']
})
export class AboutPageComponent implements OnInit {

  viewConfig = {
    title: 'Andrew Saray Tattoos',
    parentNav: '/public'
  }

  constructor() { }

  ngOnInit(): void {
  }

}
