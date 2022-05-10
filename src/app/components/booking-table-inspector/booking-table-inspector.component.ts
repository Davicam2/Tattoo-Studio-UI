import { Component, OnInit, Input, EventEmitter, OnChanges, SimpleChanges, Output } from '@angular/core';
import { MatDialog, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-booking-table-inspector',
  templateUrl: './booking-table-inspector.component.html',
  styleUrls: ['./booking-table-inspector.component.scss']
})
export class BookingTableInspectorComponent implements OnInit, OnChanges {

  @Input() configuration: inspectorModalConfig;
  @Input() bodyImages: string[];
  @Input() referenceImages: string[];

  imageClick = new EventEmitter<number>();

  imgGrpSelect = imageGroupSelect;

  onButtonAction = new EventEmitter();

  _actionGroupSetting = actionsGroup;
  _inspectorActions = inspectorActions;

  constructor(public dialogRef:MatDialogRef<BookingTableInspectorComponent>) { }

  ngOnInit(): void {
    console.log(this.configuration)
  }
  ngOnChanges(changes: SimpleChanges){
    if(changes.bodyImages || changes.referenceImages){
      // console.log(this.bodyImages);
      // console.log(this.referenceImages);
    }
  }

  buttonClickAction(evt: string){
    this.onButtonAction.emit(evt);
  }

  imageGroupSelected(selection: imageGroupSelect){
    this.imageClick.emit(selection);
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
  cancelable,
  none
}

export enum imageGroupSelect{
  bodyImage,
  referenceImage
}

