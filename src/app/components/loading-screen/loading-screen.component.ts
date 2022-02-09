import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { LoadingScreenService } from './loading-screen.service';


@Component({
  selector: 'app-loading-screen',
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.scss']
})
export class LoadingScreenComponent implements OnInit {

  color = 'primary';
  mode = 'indeterminate';
  value = 50;

  isLoading: Subject<boolean> = this.loaderSvc.showLoader;

  constructor(private loaderSvc: LoadingScreenService) { }

  ngOnInit(): void {

  }

}
