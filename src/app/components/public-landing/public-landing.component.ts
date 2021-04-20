import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { modalConfig, modalContent, NotificationModalComponent } from '../notification-modal/notification-modal.component';

@Component({
  selector: 'app-public-landing',
  templateUrl: './public-landing.component.html',
  styleUrls: ['./public-landing.component.scss']
})
export class PublicLandingComponent implements OnInit {

  headerConfig = {
    title: 'Andrew Saray Tattoos',
    parentNav: '/public'
  }
  

  constructor(
    private _router :Router,
    private activatedRoute: ActivatedRoute,
    private matDialog: MatDialog
    ) { }

  ngOnInit(): void {
  }

  navigateTo(page: string){
    this._router.navigate([page],{relativeTo: this.activatedRoute});
  }

  login(){
    let dialogRef = this.matDialog.open(NotificationModalComponent);
    let instance = dialogRef.componentInstance;
    let modalData: modalConfig = {
      title: 'User Login',
      modalSetting: modalContent.userLogin,
      modalMessage: 'Enter username and password'
    }
    instance.configuration = modalData;
  }

}
