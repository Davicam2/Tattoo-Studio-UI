import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-booking-table-inspector',
  templateUrl: './booking-table-inspector.component.html',
  styleUrls: ['./booking-table-inspector.component.scss']
})
export class BookingTableInspectorComponent implements OnInit {

  @Input() configuration: inspectorModalConfig;

  constructor(public dialogRef:MatDialogRef<BookingTableInspectorComponent>) { }

  ngOnInit(): void {
  }

}

export interface inspectorModalConfig{
  title: string,
  modalSetting: string,
  modalMessage: string,
  modalTableArray?: any[]
}