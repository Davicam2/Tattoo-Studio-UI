import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogRef} from '@angular/material/dialog';
import { FormBuilder, FormGroup} from '@angular/forms';
import {  Router } from '@angular/router';
import { Subscription } from 'rxjs';
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

  updateCost: FormGroup;

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
    private userSvc: UserService,
    private fb: FormBuilder
    
    ) { }

  ngOnInit(): void {    
      if(this.configuration.contentBody){
        if(this.configuration.contentBody.cost){
          this.updateCost = this.fb.group({
            cost: [this.configuration.contentBody.cost / 100]//booking cost inject
          })
        }
        
      }
      console.log(this.configuration)
    
    
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
  confirmButton(action: string){
    if(action == 'accept'){
      if(this.updateCost){
        this.userActions.emit(this.updateCost.value);
      } else{
        this.userActions.emit(action);
      }
    }
    if(action == 'cancel'){
      this.close();
    }
    
    
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
  POS: 'POS',
  adjustTotal: 'adjustTotal'

}
