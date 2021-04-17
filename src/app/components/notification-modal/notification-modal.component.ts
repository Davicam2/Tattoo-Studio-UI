import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-notification-modal',
  templateUrl: './notification-modal.component.html',
  styleUrls: ['./notification-modal.component.scss']
})
export class NotificationModalComponent implements OnInit {

  @Input() configuration: modalConfig;

  
  constructor( public dialogRef:MatDialogRef<NotificationModalComponent>) { }

  ngOnInit(): void {
  }


  close(){
    this.dialogRef.close();
  }

}

export interface modalConfig{
  title: string,
  modalSetting: string,
  modalMessage: string
}

export const modalContent = {
  bookingSuccess: 'bookingSuccess',

}
