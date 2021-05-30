import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';


import { BookingTableService } from 'src/app/services/booking-table.service';


@Component({
  selector: 'app-booking-table',
  templateUrl: './booking-table.component.html',
  styleUrls: ['./booking-table.component.scss']
})
export class BookingTableComponent implements OnInit, OnChanges {

  @Input() tablePropMap: Array<any>;
  @Input() defaultSort: number;
  pageToDisplay: any[];
  @Input() tableData: Array<any>;
  @Output() rowAction = new EventEmitter<{action:string,id:string}>();

  constructor() { }
 
  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges){
    if(!changes.tableData.firstChange){
      this.sortTable(this.defaultSort ? this.defaultSort : this.tablePropMap.length - 1);
    }
  }

  sortTable(index: number){
    this.tableData.sort((a,b) => a[this.tablePropMap[index].key] - b[this.tablePropMap[index].key] );
    console.log(this.tableData)
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
