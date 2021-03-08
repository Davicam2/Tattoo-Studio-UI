import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit, OnChanges {

  @Input() tableData: any[];
  @Input() numOfDisplayedRows: number;
  @Output() displayPage = new EventEmitter();

  tablePages: any[][];
  currentTablePage: any[];
  currentPageNumber: number;
  totalPages: number;

  beginningRowNum: number;
  endingRowNum: number;
  totalRowNum: number;

  constructor() { }

  ngOnInit(): void {
    this.currentPageNumber = 1;
    this.numOfDisplayedRows = 5;
    this.buildPageList();
  }

  ngOnChanges(changes: SimpleChanges){
    if(!changes.tableData.isFirstChange() ){
      this.buildPageList();
      if(this.totalPages <= 1){
        document.getElementById('navigation').style.visibility = 'hidden';
      } else{
        document.getElementById('navigation').style.visibility = 'visible';
      }
    }else if(changes.numOfDisplayedRows){
      this.buildPageList();
    }
  }

  goToFirst(){
    this.currentPageNumber = 1;
    this.changePage(this.currentPageNumber);
  }
  goToPrev(){
    if(this.currentPageNumber !== 1){
      this.currentPageNumber -= 1;
      this.changePage(this.currentPageNumber);
    }
  }
  goToNext(){
    if(this.currentPageNumber < this.totalPages){
      this.currentPageNumber += 1;
      this.changePage(this.currentPageNumber);
    }
  }
  goToLast(){
    this.currentPageNumber = this.totalPages;
    this.changePage(this.currentPageNumber);
  }

  goToPage(page: number){
    debugger;
    if(page == 0){
      return;
    }else if(page > this.totalPages){
      return;
    } else {
      this.currentPageNumber = page;
      this.changePage(this.currentPageNumber);
    }
    
  }
  
  changePage(page:number){
    if(page == 1){
      this.beginningRowNum = 1;
      this.endingRowNum = this.numOfDisplayedRows;
    }else if(page == this.totalPages){
      this.beginningRowNum = this.numOfDisplayedRows * (page - 1) + 1;
      this.endingRowNum = this.tableData.length;
    } else{
      this.beginningRowNum = this.numOfDisplayedRows * (page - 1) + 1;
      this.endingRowNum = (this.numOfDisplayedRows * page) + 1;
    }
    this.displayPage.emit(this.tablePages[page - 1]);
  }

  buildPageList(){
    if(!this.tableData){
      return;
    }

    this.tablePages = [[]];
    let pageIndex = 0; 
    this.totalPages = Math.ceil( this.tableData.length / this.numOfDisplayedRows);
    
    this.beginningRowNum = 1;
    this.endingRowNum = this.numOfDisplayedRows;
    this.totalRowNum = this.tableData.length;

    if(this.totalPages == 0){
      this.displayPage.emit(this.tableData);
      return;
    }

    for(let i = 0; i < this.tableData.length; i++){
      this.tablePages[pageIndex].push(this.tableData[i]);
      if((i + 1) % this.numOfDisplayedRows == 0 && i !== 0){
        pageIndex++;
        this.tablePages[pageIndex] = [];
      }
    }
    this.currentTablePage = this.tablePages[0];
    this.displayPage.emit(this.currentTablePage);
  }


}
