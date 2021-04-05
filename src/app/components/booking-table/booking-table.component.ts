import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { BookingTableService } from 'src/app/services/booking-table.service';


@Component({
  selector: 'app-booking-table',
  templateUrl: './booking-table.component.html',
  styleUrls: ['./booking-table.component.scss']
})
export class BookingTableComponent implements OnInit {

  @Input() tableHeaders: Array<any>;
  pageToDisplay: any[];
  @Input() tableData: Array<any>;
  @Output() rowAction = new EventEmitter<{action:string,id:string}>();


  constructor() { }

  ngOnInit(): void {

  }

  setPage(page:any[]){
    //changes data after initial page render
    setTimeout(() => {
      this.pageToDisplay = page;
    })
  }

  rowAffirmativeAction(id: string){
    this.rowAction.emit({action:'accept', id:id});
    
  }

  rowNegativeAction(id: string){
    this.rowAction.emit({action:'reject', id:id});
  }
}
