import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-booking-table-inspector',
  templateUrl: './booking-table-inspector.component.html',
  styleUrls: ['./booking-table-inspector.component.scss']
})
export class BookingTableInspectorComponent implements OnInit {

  @Input() configuration: inspectorModalConfig;
  onButtonAction = new EventEmitter();

  constructor(public dialogRef:MatDialogRef<BookingTableInspectorComponent>) { }

  ngOnInit(): void {
  }

  clickRFI(){
    this.onButtonAction.emit(inspectorActions.rfi);
  }
  clickAccept(){
    this.onButtonAction.emit(inspectorActions.accept);
  }
  clickReject(){
    this.onButtonAction.emit(inspectorActions.reject);
  }

}

export interface inspectorModalConfig{
  title: string,
  modalSetting: string,
  modalMessage: string,
  modalTableArray: any[]
}

export const inspectorActions = {
  rfi: 'RFI',
  accept: 'accept',
  reject: 'reject',
}