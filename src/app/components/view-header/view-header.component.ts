import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-header',
  templateUrl: './view-header.component.html',
  styleUrls: ['./view-header.component.scss']
})
export class ViewHeaderComponent implements OnInit {
  @Input() title: string;
  @Input() navUrl: string;

  constructor(private _router: Router) { }

  ngOnInit(): void {
  }

  navigateHome(){
    this._router.navigate([this.navUrl]);
  }

}
