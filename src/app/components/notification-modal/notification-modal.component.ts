import { Component, Input, OnInit } from '@angular/core';
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
export class NotificationModalComponent implements OnInit {

  @Input() configuration: modalConfig;

  subscriptions = new Subscription();

  loginValues = {
    userName:'',
    pass: ''
  }
  
  constructor( 
    public dialogRef:MatDialogRef<NotificationModalComponent>,
    private _router: Router,
    private userSvc: UserService
    
    ) { }

  ngOnInit(): void {
    

  }

  close(){
    this.dialogRef.close();
  }

  navigateTo(url: string){
    this._router.navigate([url]);
    this.close();
  }

  tryLogin(){
    this.userSvc.checkForUser(this.loginValues.userName, this.loginValues.pass)
    this.close();
  }


}

export interface modalConfig{
  title: string,
  modalSetting: string,
  modalMessage: string,
  modalTableArray?: any[]
}

export const modalContent = {
  bookingSuccess: 'bookingSuccess',
  userLogin: 'login',
  inspectBooking: 'inspectBooking',
  errorMessage: 'errorMessage'

}
