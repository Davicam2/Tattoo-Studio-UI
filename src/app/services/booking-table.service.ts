import { Injectable } from '@angular/core';
import { RuntimeConfigService } from 'src/app/services/runtime-config.service';


@Injectable({
  providedIn: 'root'
})
export class BookingTableService {

  constructor(private appConfig: RuntimeConfigService) { }

  getTableHeaders(){
    return this.appConfig.getConfig().BOOKINGTABLE.headers;
  }


}