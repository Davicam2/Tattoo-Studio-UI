import { formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, Subscription, combineLatest, forkJoin, zip } from 'rxjs';
import { map } from 'rxjs/operators';
import { 
  modalContent, 
  inspectorModalConfig,
  inspectorActions, 
  BookingTableInspectorComponent, 
  ICalendarEvent, 
  ICalendarOptions, 
  BookingActionModalComponent, 
  IActionModalConfig, 
  actionsGroup, 
  NotificationModalComponent, 
  modalConfig, 
  imageGroupSelect, 
  bookingTableActionButtonConf} from 'src/app/components';
import { ImageSliderModalComponent } from 'src/app/components/image-slider-modal/image-slider-modal.component';
import { bookingPMap, Ibooking, IReservation } from 'src/app/interfaces';
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
  reservations = new Subject<Array<IReservation>>();
  tableData = [];
  tableHeaders = [];

  calendarEvents: Array<{start:string, end:string, title: string, id: string}> = []; 
  calendarOptions: ICalendarOptions = {
    dateConstraints:{
      futureDatesOnly: false
    },
    calendarConfig: {
      month:true,
      week: true,
      day: true
    }
  }

  bookingInspectorImgs = {
    body: [],
    reference: []
  }
  inspDialogRef;

  _calendarEvents: Array<ICalendarEvent> = [];
  //=================//

  tableConfig = this.appConfig.getConfig().BOOKINGTABLE;
  showTableButtons = bookingTableActionButtonConf.showAll;
  modalConfig = this.appConfig.getConfig().MODAL_CONFIGS;
  tableViewSelect: string = 'requested';
  tableNoResultsMessage = 'No Results';
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
    this.resSvc.getReservationList();

   
    
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
    ).add(
      this.resSvc.reservationListChanged$.subscribe(
        (event) => {
          if(!event.isError){
            this.resSvc.getReservationList();
            //TODO: get updated reservations list
          }
        }
      )
    ).add(
      this.resSvc.reservedDateList$.subscribe(
        (res) => {
          if(res){
            console.log(res);
            this.reservations.next(res.content)
          }
          
        }
      )
    ).add(
      combineLatest(
        this.resSvc.reservedDateList$,
        this.tblService.bookings$
      ).subscribe(
        ([resvs, books]) => {
          if(resvs && books){
            this.createCalendarEvts(books.content, resvs.content);
          }
          
        }
      )
    ).add(
      this.tblService.bookingImageLinks$.subscribe(
        res => {
          this.bookingInspectorImgs = {
            body: res.content.bodyUrls,
            reference: res.content.refUrls
          }

          this.inspDialogRef.componentInstance.bodyImages = this.bookingInspectorImgs.body;
          this.inspDialogRef.componentInstance.referenceImages = this.bookingInspectorImgs.reference;
       
        }
      )
    ).add(
      this.tblService.cancelBookingResponse$.subscribe(
        res => {
          
          let dialogRef = this.matDialog.open(NotificationModalComponent);
          let instance = dialogRef.componentInstance;
          let modalData: modalConfig = {
            title: 'Cancelation Confirmation',
            modalSetting: modalContent.errorMessage,
            modalMessage: 'The booking has been canceled. The customer will receive an email asking them to select a new date',
            contentBody: res
          }
          instance.configuration = modalData;
          this._calendarEvents = this._calendarEvents.filter( item => item.id !== res.content.id);
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
    
    rows.forEach(row => {
      structuredTableRow = new Object();
     
      this.tableConfig.headers.map(
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
       
      if(this.tableViewSelect === 'requested'){
        this.showTableButtons = bookingTableActionButtonConf.showAll;
        this.tableNoResultsMessage = 'No Pending Requests To Review';
        if(row.status === 'requested'){
          this.tableData.push(structuredTableRow);
        } 
      }else if (this.tableViewSelect === 'upcoming'){
        this.showTableButtons = bookingTableActionButtonConf.showNegative;
        this.tableNoResultsMessage = 'No Upcoming Bookings';
        if(row.endDate >= Date.parse(Date())){
          this.tableData.push(structuredTableRow);
        }
      }else if (this.tableViewSelect === 'accepted'){
        this.showTableButtons = bookingTableActionButtonConf.showNegative;
        this.tableNoResultsMessage = 'No Requests Pending Deposit';
        if(row.status === 'accepted'){
          this.tableData.push(structuredTableRow);
        }
      }else if (this.tableViewSelect === 'historic'){
        this.showTableButtons = bookingTableActionButtonConf.showNone;
        this.tableNoResultsMessage = 'No Bookings in History';
        if(row.endDate < Date.parse(Date())) {
          this.tableData.push(structuredTableRow);
        }
      }
    });
  }

  bookingAction(evt:{action:string,id:string}){  
    if(evt.action === 'accept'){  
      this.acceptBooking(evt.id);
    } else if(evt.action === 'reject'){
      this.rejectBooking(evt.id)
    } else if(evt.action === 'selected'){
      
      //TODO: complete this line of logic once security is fixed
      this.tblService.getBookingImageLinks(evt.id);

      this.inspDialogRef = this.matDialog.open(BookingTableInspectorComponent);
      let instance = this.inspDialogRef.componentInstance;
      let selectedBooking = this.bookings.find(booking => booking.id == evt.id);
      let rowValues: Array<{title: string, value: string}> = new Array();

      for(let mapKey of Object.keys(bookingPMap)){
        for(let key of Object.keys(selectedBooking)){
          if(key === mapKey){
            rowValues.push({title: bookingPMap[mapKey], value: selectedBooking[key] })
          }
        }
      }
  
      //decide which button config for inspection modal (actions from modal)
      let actGrp = 0;
      if(selectedBooking.status == 'requested'){
        actGrp = actionsGroup.bookingActions;
      } else if (selectedBooking.endDate < new Date()){
        actGrp = actionsGroup.none
      } else if(selectedBooking.status == 'booked'){
        actGrp = actionsGroup.cancelable
      } 
     
      let modalData: inspectorModalConfig = {
        title: this.modalConfig.INSPECT_BOOKING.title,
        modalState: selectedBooking.status,
        modalMessage: this.modalConfig.INSPECT_BOOKING.message,
        modalTableArray: rowValues,
        modalActionsGroup: actGrp
      }
      instance.configuration = modalData;

      this.inspDialogRef.componentInstance.onButtonAction.subscribe((action: string) => {
      
        if(action === inspectorActions.accept){
          this.acceptBooking(evt.id);
          this.inspDialogRef.close();
        }else if( action === inspectorActions.reject){
          this.rejectBooking(evt.id);
        }else if( action === inspectorActions.rfi){
          //TODO: initiate rfi email builder
        } else if( action === inspectorActions.cancel){
          this.cancelBooking(evt.id);
        }
      })

      this.inspDialogRef.componentInstance.imageClick.subscribe((selection: imageGroupSelect) => {
        this.callImageInspector(selection);
      })
    }
  }

  dateBlockAction(start: Date, end: Date, allDay: boolean, view?: any){
    const title = prompt('Add title to date block');
    if(title){
     this.resSvc.requestAReservation(start,end,allDay,title);
    }
  }

  acceptBooking(id: string){
    let dialogRef = this.matDialog.open(BookingActionModalComponent);
    let instance = dialogRef.componentInstance;
    let modalConfig: IActionModalConfig = {
      title: 'actions title',
      modalMessage: 'accepting this booking',
      id: id
    }

    instance.configuration = modalConfig;

    dialogRef.componentInstance.onButtonAction.subscribe((submission) => {
      if(submission.action === 'accept'){
        this.tblService.acceptBooking(id,submission.data)
        dialogRef.close();
      }
    })
  }

  rejectBooking(id: string){
   
    let inspDialogRef = this.matDialog.open(NotificationModalComponent);
    let instance = inspDialogRef.componentInstance;
    let config: modalConfig = {
      title: "Please Confirm",
      modalMessage: "Are you sure you want to reject?",
      modalSetting: "confirmation",
    }
    instance.configuration = config;
    instance.userActions.subscribe((action: string) => {
      if(action == 'accept'){
        this.tblService.rejectBooking(id);
        if(this.inspDialogRef){
          this.inspDialogRef.close();
        }
        instance.close();
      }
      if(action == 'cancel'){
        instance.close()
      }
    })

    
  }

  cancelBooking(id: string){
    let inspDialogRef = this.matDialog.open(NotificationModalComponent);
    let instance = inspDialogRef.componentInstance;
    let config:modalConfig = {
      title: 'Please Confirm',
      modalMessage: 'Are you sure you want to cancel?',
      modalSetting: 'confirmation',

    }
    instance.configuration = config;
    instance.userActions.subscribe((action: string) => {
      if(action == 'accept'){
        this.tblService.cancelBooking(id);
        if(this.inspDialogRef){
          this.inspDialogRef.close();
        }
        instance.close();
      }
      if(action == 'cancel'){
        instance.close()
      }
    })
    

  }

  private createCalendarEvts( bookings?: Array<Ibooking>, reservations?: Array<IReservation>){
    let tempArr: Array<ICalendarEvent> = [];

    if(bookings){
      bookings.map(
        booking => {
          if(booking.status === 'booked'){
            tempArr.push(
              {
                start: booking.startDate,
                end: booking.endDate,
                allDay: booking.allDay,
                title: `${booking.nameFirst} ${booking.nameLast}`,
                id: booking.id,
                type: 'booking',
                color: 'blue'
              }
            )
          }
        }
      )
    }
    if (reservations){
      reservations.map(
        res => {
          tempArr.push(
            {
              start: res.start,
              end: res.end,
              allDay: res.allDay,
              title: res.title,
              id: res.id,
              type: 'reservation',
              color: 'grey'
            }
          )
        }
      )
    }
    this._calendarEvents = [...tempArr];
  }

  callImageInspector(selection: imageGroupSelect){
    this.inspDialogRef = this.matDialog.open(ImageSliderModalComponent, {
      height:'fit-content',
      width:'90vw'
    });
    let instance = this.inspDialogRef.componentInstance;
    if(selection === imageGroupSelect.bodyImage){
      instance.imageUrls = this.bookingInspectorImgs.body;
    } else if (selection === imageGroupSelect.referenceImage){
      instance.imageUrls = this.bookingInspectorImgs.reference;
    }
    

  }

  calendarEventSelect(event){
    if(event.type === 'booking'){
      this.bookingAction({action:'selected', id:event.id})
    }else if (event.type === 'reservation'){
      if(confirm('Remove this date reservation?')){
        this.resSvc.deleteReservation(event.id);
        
      }
    }
  }

  calendarDateSelect(event){
    this.dateBlockAction(event.start, event.end, event.allDay);
    console.log(event)
  }

  ngOnDestroy(){
    this.subscriptions.unsubscribe();
  }

 


}
