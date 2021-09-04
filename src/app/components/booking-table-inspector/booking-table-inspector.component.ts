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

  _actionGroupSetting = actionsGroup;
  _inspectorActions = inspectorActions;

  constructor(public dialogRef:MatDialogRef<BookingTableInspectorComponent>) { }

  ngOnInit(): void {
    console.log(this.configuration)
  }

  buttonClickAction(evt: string){
    this.onButtonAction.emit(evt);
  }

}

export interface inspectorModalConfig{
  title: string,
  modalState: string,
  modalMessage: string,
  modalTableArray: any[],
  modalActionsGroup?: number
}

export const inspectorActions = {
  rfi: 'RFI',
  accept: 'accept',
  reject: 'reject',
  cancel: 'cancel'
}
export enum actionsGroup{
  bookingActions,
  cancelable

}

