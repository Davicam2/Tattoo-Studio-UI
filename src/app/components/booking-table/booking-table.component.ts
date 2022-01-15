import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { findIndex } from 'rxjs/operators';


import { BookingTableService } from 'src/app/services/booking-table.service';


@Component({
  selector: 'app-booking-table',
  templateUrl: './booking-table.component.html',
  styleUrls: ['./booking-table.component.scss']
})
export class BookingTableComponent implements OnInit, OnChanges {

  @Input() tablePropMap: Array<any>;
  headersToDisplay: Array<any>;
  @Input() defaultSort: number;
  @Input() showActionButtons: boolean = false;
  @Input() tableData: Array<any>;
  @Input() noResultsMessage: string;
  @Output() rowAction = new EventEmitter<{action:string,id:string}>();

  pageToDisplay: any[];

  constructor() { }
 
  ngOnInit(): void {
    this.headersToDisplay = this.tablePropMap;
  }

  ngOnChanges(changes: SimpleChanges){
    if(!changes.tableData.firstChange){
      this.sortTable(this.defaultSort ? this.defaultSort : this.tablePropMap.length - 1);
    }
  }

  sortTable(index: number){
    this.tableData.sort((a,b) => a[this.tablePropMap[index].key] - b[this.tablePropMap[index].key] );
    console.log(this.tableData)
    // removes the first header if action butons are set to off
    if(!this.showActionButtons){
      this.headersToDisplay = this.tablePropMap.filter( x => this.tablePropMap.indexOf(x) > 0 );
    }
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

  rowSelection(id: string){
    this.rowAction.emit({action:'selected', id:id});
  }
}
