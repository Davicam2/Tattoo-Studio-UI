import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-faq-page',
  templateUrl: './faq-page.component.html',
  styleUrls: ['./faq-page.component.scss']
})
export class FaqPageComponent implements OnInit {

  headerConfig = {
    title: 'Andrew Saray Tattoos',
    parentNav: 'public'
  }

  constructor() { }

  ngOnInit(): void {
  }

}
