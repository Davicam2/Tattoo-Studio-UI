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
  bookingTableActionButtonConf,
  StripeProcessorComponent,
  stripePurchaseDetails
} from 'src/app/components';
import { ImageSliderModalComponent } from 'src/app/components/image-slider-modal/image-slider-modal.component';
import { bookingPMap, Ibooking, IReservation } from 'src/app/interfaces';
import { BookingTableService } from 'src/app/services/booking-table.service';
import { ReservationService } from 'src/app/services/reservation.service';
import { RuntimeConfigService } from 'src/app/services/runtime-config.service';
import { StripeService } from 'src/app/services/stripe.service';




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
    private bookingService: BookingTableService,
    private appConfig: RuntimeConfigService,
    private matDialog: MatDialog,
    private resSvc: ReservationService,
    private stripeService: StripeService
    ) { }

  ngOnInit(): void {
    this.tableHeaders = this.bookingService.getTableHeaders();
    this.bookingService.getBookings();
    this.resSvc.getReservationList();

   
    
    this.subscriptions.add(
      this.bookingService.bookings$.subscribe(
        data => {
          if(!data) return;
          this.bookings = data.content;
          this.buildTableData(data.content);
        }
      )
    ).add(
      this.bookingService.bookingUpdateResponse$.subscribe(
        data => { 
          this.bookingService.getBookings();
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
        this.bookingService.bookings$
      ).subscribe(
        ([resvs, books]) => {
          if(resvs && books){
            this.createCalendarEvts(books.content, resvs.content);
          }
          
        }
      )
    ).add(
      this.bookingService.bookingImageLinks$.subscribe(
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
      this.bookingService.cancelBookingResponse$.subscribe(
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
    ).add(

      this.stripeService.requestPaymentResponse$.subscribe(
        res => {
          console.log(res);
          //alert('payment request Recieved');
          let dialogRef = this.matDialog.open(NotificationModalComponent);
          let instance = dialogRef.componentInstance;
          let modalData: modalConfig 

          //TODO: abstract to notification modal function
          if(res.content.service){
            modalData = {
              title: 'Point of Sale Transaction Confirmation',
              modalSetting: modalContent.POS,
              modalMessage: 'Payment Recieved',
              contentBody: res
            } 
          } else if(res.isError){
            modalData = {
              title: 'Transaction Error',
              modalSetting: modalContent.errorMessage,
              modalMessage: 'Payment alread recieved in full',
              contentBody: res
            } 
          } else{
            modalData = {
              title: 'Payment Confirmation',
              modalSetting: modalContent.paymentResponse,
              modalMessage: 'Payment Recieved',
              contentBody: res
            } 
          }
          
          
          instance.configuration = modalData;
          dialogRef.afterClosed().subscribe(() => {
            this.matDialog.closeAll()
          })
          
        }
      )
    ).add(
      this.bookingService.updateBooking$.subscribe(
        res => {
          if(!res.isError){
            this.stripeInstance(res.content.id, res.content.cost, res.content.date);
          }
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
      this.bookingService.getBookingImageLinks(evt.id);

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
      let yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1)

      if(selectedBooking.status == 'requested'){
        actGrp = actionsGroup.bookingActions;
      } else if (selectedBooking.endDate < yesterday){
        actGrp = actionsGroup.none
      } else if(selectedBooking.status == 'booked' || selectedBooking.status == 'accepted'){
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
      
        console.log(action)
        if(action === inspectorActions.accept){
          this.acceptBooking(selectedBooking.id);
          this.inspDialogRef.close();
        }else if( action === inspectorActions.reject){
          this.rejectBooking(selectedBooking.id);
        }else if( action === inspectorActions.rfi){
          //TODO: initiate rfi email builder
        } else if( action === inspectorActions.cancel){
          this.cancelBooking(selectedBooking.id);
        } else if( action === inspectorActions.makePayment){
          
          this.confirmTotalDialog(selectedBooking.id,selectedBooking.cost,selectedBooking.startDate);
        } else if(action === inspectorActions.clearTab){
          
          this.clearPayment(selectedBooking.id)
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
        this.bookingService.acceptBooking(id,submission.data)
        dialogRef.close();
      }
    })
  }

  stripeInstance(id, cost, date){
    let dialogRef = this.matDialog.open(StripeProcessorComponent);
    let instance = dialogRef.componentInstance;
    let config:stripePurchaseDetails = {
      amount: cost,
      bookedDate: date,
      amountType: "Tattoo Cost"
    }
    instance.bookingDetails = config;

    dialogRef.componentInstance.tokenGenerated.subscribe((token) => {
      this.stripeService.requestPayment(token, id, "bill");
    })
  }

  confirmTotalDialog(id, cost, date){
    let dialogRef = this.matDialog.open(NotificationModalComponent);
    let instance = dialogRef.componentInstance;
    let config: modalConfig = {
      title: "Please Confirm or update",
      modalMessage: "Please update or confirm current total cost",
      modalSetting: modalContent.adjustTotal,
      contentBody: {cost: cost}
    }
    instance.configuration = config;

    instance.userActions.subscribe((action: any) => {
      console.log('update cost', action)
 
      if(action.cost == (cost / 100)){
        
        this.stripeInstance(id, cost, date);
        instance.close();
      }else {
        this.bookingService.updateBookingProperty(id,'cost',action.cost * 100);
        instance.close()
      }
    })
    
  }

  rejectBooking(id: string){
   
    let inspDialogRef = this.matDialog.open(NotificationModalComponent);
    let instance = inspDialogRef.componentInstance;
    let config: modalConfig = {
      title: "Please Confirm",
      modalMessage: "Are you sure you want to reject?",
      modalSetting: modalContent.confirmation,
    }
    instance.configuration = config;
    instance.userActions.subscribe((action: string) => {
      if(action == 'accept'){
        this.bookingService.rejectBooking(id);
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
        this.bookingService.cancelBooking(id);
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

  
  clearPayment(id: string){
   
    let inspDialogRef = this.matDialog.open(NotificationModalComponent);
    let instance = inspDialogRef.componentInstance;
    let config:modalConfig = {
      title: 'Please Confirm',
      modalMessage: 'In person transaction',
      modalSetting: 'confirmation',

    }
    instance.configuration = config;
    instance.userActions.subscribe((action: string) => {
      if(action == 'accept'){
        //this.bookingService.updateBookingProperty(id,'cost',0);
        this.stripeService.requestPayment(null , id, inspectorActions.clearTab);
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
                color: booking.finalPaid ? '#000' : '#007c1c' 
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
    console.log("button click")
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
