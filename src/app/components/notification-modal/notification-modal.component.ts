import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-notification-modal',
  templateUrl: './notification-modal.component.html',
  styleUrls: ['./notification-modal.component.scss']
})
export class NotificationModalComponent implements OnInit {
  @Input() modalContent: string;

  constructor() { }

  ngOnInit(): void {
  }

}

export const modalContent = {
  actionSuccess: 'actionSuccess',

}
