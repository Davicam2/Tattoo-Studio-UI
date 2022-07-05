import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-booking-action-modal',
  templateUrl: './booking-action-modal.component.html',
  styleUrls: ['./booking-action-modal.component.scss']
})
export class BookingActionModalComponent implements OnInit {

  adminActionsFm: FormGroup;
  subscriptions = new Subscription();

  @Input() configuration: IActionModalConfig;
  onButtonAction = new EventEmitter();

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {

    this.configuration = {
      title: '',
      modalMessage: '',
      id: ''
    }

    this.adminActionsFm = this.fb.group({
      aptLength: ['allDay', [Validators.required]],
      tattooCost: [ , [Validators.required]],
      //startTime: [0 ,[Validators.required]],
      depositAmount: [300, Validators.required],
      adminComments: ['']
    })

  }
  
  aptLengthSelect(){

  }

  onSubmit(form){
    this.onButtonAction.emit({action: 'accept', data: form});
    console.log(form);
  }
  //actions: select length of appointment, submit cost of tattoo, add comments, view details of tattoo

  startTimes: Array<{value: number, text: string}> = [
    {value: -6, text: '6:00 am'},
    {value: -5, text: '7:00 am'},
    {value: -4, text: '8:00 am'},
    {value: -3, text: '9:00 am'},
    {value: -2, text: '10:00 am'},
    {value: -1, text: '11:00 am'},
    {value: 0, text: '12:00 pm'},
    {value: 1, text: '1:00 pm'},
    {value: 2, text: '2:00 pm'},
    {value: 3, text: '3:00 pm'},
    {value: 4, text: '4:00 pm'},
    {value: 5, text: '5:00 pm'},
    {value: 6, text: '6:00 pm'},
    {value: 7, text: '7:00 pm'},
    {value: 8, text: '8:00 pm'},
    
  ]
}

export interface IActionModalConfig {
  title: string,
  modalMessage: string,
  id: string

}
