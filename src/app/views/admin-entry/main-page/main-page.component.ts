import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { modalContent, inspectorModalConfig, BookingTableInspectorComponent } from 'src/app/components';
import { bookingPMap } from 'src/app/interfaces';
import { BookingTableService } from 'src/app/services/booking-table.service';
import { RuntimeConfigService } from 'src/app/services/runtime-config.service';


@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit, OnDestroy {
  // send to child===\\
  bookings = [];
  tableData = [];
  tableHeaders = [];
  //=================//

  tableConfig = this.appConfig.getConfig().BOOKINGTABLE.headers;
  modalConfig = this.appConfig.getConfig().MODAL_CONFIGS;
  tableViewSelect: string = 'pending';

  subscriptions = new Subscription();

  viewConfig = {
    title: 'Andrew Saray Tattoos',
    parentNav: '/admin'
  }

  constructor(
    private tblService: BookingTableService,
    private appConfig: RuntimeConfigService,
    private matDialog: MatDialog,
    ) { }

  ngOnInit(): void {
    this.tableHeaders = this.tblService.getTableHeaders();
    this.tblService.getBookings();

    this.subscriptions.add(
      this.tblService.bookings$.subscribe(
        data => {
          if(!data) return;
          this.bookings = data.content;
          this.buildTableData(data.content);
        }
      )
    ).add(
      this.tblService.bookingUpdateResponse$.subscribe(
        data => { 
          this.tblService.getBookings();
          //this.eventControl(data);
          // if( data.origin === this.tblService.apiOrigins.acceptBooking){
          //   this.tblService.getBookings();
          // }
        }
      )
    )
  }

  tableViewChange(){
    this.buildTableData(this.bookings);
  }

  buildTableData(rows){
    //TODO: not long term solution, need dynamic mapping solution
    let structuredTableRow: Object;
    this.tableData = [];
    if(!rows) return;
    rows.filter( row => row.status === this.tableViewSelect).forEach(row => {
      structuredTableRow = new Object();
      this.tableConfig.map(
        value => {
          switch (value.key){
            case 'name':{
              structuredTableRow[value.key] = row.nameFirst + ' ' + row.nameLast;
              break;
            }
            case 'desc':{
              structuredTableRow[value.key] = row.tattooDesc;
              break
            }
            case 'refPhotos': {
              structuredTableRow[value.key] = 'placeholder';
              break;
            }
            case 'placement': {
              structuredTableRow[value.key] = row.tattooPlacement;
              break;
            }
            case 'bodyPhotos': {
              structuredTableRow[value.key] = 'placeholder';
              break;
            }
            case 'email': {
              structuredTableRow[value.key] = row.email;
              break;
            }
            case 'phoneNum' :{
              structuredTableRow[value.key] = row.phoneNumber;
              break;
            } 
            case 'subDate' :{
              structuredTableRow[value.key] = row.submissionDate;
              break
            }
          }
        }
      )
      structuredTableRow['id'] = row.id;
      this.tableData.push(structuredTableRow);
    });
  }

  bookingAction(evt:{action:string,id:string}){
    if(evt.action === 'accept'){
      this.tblService.acceptBooking(evt.id);
    } else if(evt.action === 'reject'){
      this.tblService.rejectBooking(evt.id)
    } else if(evt.action === 'selected'){
      
      let dialogRef = this.matDialog.open(BookingTableInspectorComponent);
      let instance = dialogRef.componentInstance;
      let selectedBooking = this.bookings.find(booking => booking.id == evt.id);
      let rowValues: Array<{title: string, value: string}> = new Array();

      for(let mapKey of Object.keys(bookingPMap)){
        for(let key of Object.keys(selectedBooking)){
          if(key === mapKey){
            rowValues.push({title: bookingPMap[mapKey], value: selectedBooking[key] })
          }
        }
      }
      

      

      let modalData: inspectorModalConfig = {
        title: this.modalConfig.INSPECT_BOOKING.title,
        modalSetting: modalContent.inspectBooking,
        modalMessage: this.modalConfig.INSPECT_BOOKING.message,
        modalTableArray: rowValues
      }
      instance.configuration = modalData;
    }
  }

 

  ngOnDestroy(){
    this.subscriptions.unsubscribe();
  }

}
