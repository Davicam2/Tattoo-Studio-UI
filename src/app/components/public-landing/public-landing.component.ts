import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-public-landing',
  templateUrl: './public-landing.component.html',
  styleUrls: ['./public-landing.component.scss']
})
export class PublicLandingComponent implements OnInit {

  constructor(
    private _router :Router,
    private activatedRoute: ActivatedRoute
    ) { }

  ngOnInit(): void {
  }

  navigateTo(page: string){
    this._router.navigate([page],{relativeTo: this.activatedRoute});
  }

}
