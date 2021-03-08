import { Component, OnInit } from '@angular/core';
import { BookingTableService } from 'src/app/services/booking-table.service';


@Component({
  selector: 'app-booking-table',
  templateUrl: './booking-table.component.html',
  styleUrls: ['./booking-table.component.scss']
})
export class BookingTableComponent implements OnInit {
  tableHeaders;
  pageToDisplay: any[];
  constructor(private tblService: BookingTableService) { }

  ngOnInit(): void {
    this.tableHeaders = this.tblService.getTableHeaders();
    console.log(this.fauxTableData);
    console.log(this.tableHeaders);
  

  }
  setPage(page:any[]){
    //changes data after initial page render
    setTimeout(() => {
      this.pageToDisplay = page;
    })
  }

  acceptBooking(){

  }
  declineBooking(){
    
  }

  fauxTableData = [
    {
      name:"First Customer",
      desc:"tribal tattoo",
      refPhotos: [1,2,3],
      placement:"Left Side Back",
      bodyPhotos: [1,2],
      email: "FirstCustomer@fc.com",
      phoneNum:"1238904567",
      subDate: new Date('3/25/2021')
    },
    {
      name:"Second Customer",
      desc:"rose thing",
      refPhotos: [1,2,3,4],
      placement:"back of both legs",
      bodyPhotos: [1,2,3],
      email: "secondCustomer@sc.com",
      phoneNum:"3216540987",
      subDate: new Date('3/28/2021')
    },
    {
      name:"Third Customer",
      desc:"full body yakuza",
      refPhotos: [1,2,3,4,5,6],
      placement:"errywherrrr",
      bodyPhotos: [1,2],
      email: "thridcustomer@tc.com",
      phoneNum:"0987654321",
      subDate: new Date('4/25/2021')
    },
    {
      name:"Third Customer",
      desc:"full body yakuza",
      refPhotos: [1,2,3,4,5,6],
      placement:"errywherrrr",
      bodyPhotos: [1,2],
      email: "thridcustomer@tc.com",
      phoneNum:"0987654321",
      subDate: new Date('4/25/2021')
    },
    {
      name:"Third Customer",
      desc:"full body yakuza",
      refPhotos: [1,2,3,4,5,6],
      placement:"errywherrrr",
      bodyPhotos: [1,2],
      email: "thridcustomer@tc.com",
      phoneNum:"0987654321",
      subDate: new Date('4/25/2021')
    },
    {
      name:"Third Customer",
      desc:"full body yakuza",
      refPhotos: [1,2,3,4,5,6],
      placement:"errywherrrr",
      bodyPhotos: [1,2],
      email: "thridcustomer@tc.com",
      phoneNum:"0987654321",
      subDate: new Date('4/25/2021')
    }
  ]
  

}
