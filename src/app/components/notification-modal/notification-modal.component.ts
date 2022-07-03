import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogRef} from '@angular/material/dialog';
import {  Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { skip } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-notification-modal',
  templateUrl: './notification-modal.component.html',
  styleUrls: ['./notification-modal.component.scss']
})
export class NotificationModalComponent implements OnInit{

  @Input() configuration: modalConfig;
  userActions = new EventEmitter();

  subscriptions = new Subscription();

  loginValues = {
    userName:'',
    pass: ''
  }

  timeslotSelection = {
    selection: 'am'
    
  }
  
  constructor( 
    public dialogRef:MatDialogRef<NotificationModalComponent>,
    private _router: Router,
    private userSvc: UserService
    
    ) { }

  ngOnInit(): void {
    
    console.log(this.configuration.contentBody)
  }

  close(){

    if(this.configuration.modalSetting === modalContent.timeslotSelect){
      this.dialogRef.close(this.timeslotSelection.selection);
    }else{
      this.dialogRef.close();
    }
  }

  navigateTo(url: string){
    this._router.navigate([url]);
    this.close();
  }

  tryLogin(){
    this.userSvc.checkForUser(this.loginValues.userName, this.loginValues.pass)
    this.close();
  }
  confirmButton(selection: string){
    this.userActions.emit(selection);
  }
}

export interface modalConfig{
  title: string,
  modalSetting: string,
  modalMessage: string,
  modalTableArray?: any[],
  contentBody?: any
}

export const modalContent = {
  bookingSuccess: 'bookingSuccess',
  userLogin: 'login',
  inspectBooking: 'inspectBooking',
  errorMessage: 'errorMessage',
  paymentResponse: 'paymentResponse',
  timeslotSelect: 'timeslotSelect',
  confirmation: 'confirmation',
  POS: 'POS'

}
