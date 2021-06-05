import { formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { modalContent, inspectorModalConfig,inspectorActions, BookingTableInspectorComponent } from 'src/app/components';
import { bookingPMap, Ibooking } from 'src/app/interfaces';
import { BookingTableService } from 'src/app/services/booking-table.service';
import { ReservationService } from 'src/app/services/reservation.service';
import { RuntimeConfigService } from 'src/app/services/runtime-config.service';


@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit, OnDestroy {
  // send to child===\\
  bookings: Array<Ibooking> = [];
  tableData = [];
  tableHeaders = [];

  calendarEvents: Array<{start:string, end:string, title: string, id: string}> = []; 
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
    private resSvc: ReservationService
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
          this.createCalendarEvents(data.content);
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
      this.acceptBooking(evt.id);
    } else if(evt.action === 'reject'){
      this.rejectBooking(evt.id)
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
        modalState: selectedBooking.status,
        modalMessage: this.modalConfig.INSPECT_BOOKING.message,
        modalTableArray: rowValues
      }
      instance.configuration = modalData;
      dialogRef.componentInstance.onButtonAction.subscribe((action: string) => {
        if(action === inspectorActions.accept){
          this.acceptBooking(evt.id)
          dialogRef.close();
        }else if( action === inspectorActions.reject){
          this.rejectBooking(evt.id)
          dialogRef.close();
        }else if( action === inspectorActions.rfi){
          // initiate rfi email builder
        }
      })
    }
  }

  dateBlockAction(start: string, end: string, allDay: boolean, view?: any){
    const title = prompt('Please enter a new title for your event');

    if(title){
      
    }
    debugger;
  }

  acceptBooking(id: string){
    this.tblService.acceptBooking(id)
  }
  rejectBooking(id: string){
    this.tblService.rejectBooking(id);
  }

  //TODO: base logic off booking status instead of requested date
  //set fullday or half day properties
  createCalendarEvents(data: [Ibooking]){
    let tempArr: Array<{start:string, end:string, title: string, id: string}> = [];

    for(let booking of data){
      if(booking.requestedDate.toString() !== 'tbd'){
        tempArr.push(
          {
            start: formatDate(booking.requestedDate, 'yyyy-MM-dd', 'en-US'),
            end: formatDate(booking.requestedDate, 'yyyy-MM-dd', 'en-US'),
            title: `${booking.nameFirst} ${booking.nameLast} appointment`,
            id: booking.id
          }
        )
      }
    }

    if(tempArr.length > 0){
      this.calendarEvents =  [...tempArr];
    }

  }

  calendarEventSelect(id){
    this.bookingAction({action:'selected', id:id})
   
  }

  calendarDateSelect(event){
    this.dateBlockAction(event.start, event.end, event.allDay);
    console.log(event)
  }

  ngOnDestroy(){
    this.subscriptions.unsubscribe();
  }


}
